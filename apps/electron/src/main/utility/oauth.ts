import {
	AccountScope,
	OauthAuthorizationCodeResponse,
	OauthRedirectErrorQueryParameters,
	OauthTokenResponse,
	SignableTokenStructure,
} from '@shared/types/auth.types'
import express, { Express } from 'express'
import { Server } from 'http'
import { openExternalBrowserWindow } from './openExternalBrwoserWindow'
import { randomBytes, createHash } from 'crypto'
import { v4 } from 'uuid'
import axios from 'axios'
import redirectErrorUrl from '../../../resources/redirectError.html?asset'
import redirectSuccessUrl from '../../../resources/redirectSuccess.html?asset'
import { OauthError } from '@shared/errors/oauthError'
import { RequestError } from '@shared/errors/requestError'
import { BulkyError } from '@shared/errors/bulkyError'

/**
 * The server should not be constantly listening, only when an oauth request is fired.
 * However, we don't control the opened browser window and therefore cannot know if the user closed the window without authorizing
 */
let serverRunning: boolean = false
let codeVerifier: string | undefined = undefined
const authorizationState = v4()
const authorizationCodeBaseUrl = import.meta.env.VITE_POE_BASE_AUTH_URL
const tokenExchangeUrl = import.meta.env.VITE_POE_BASE_TOKEN_URL

/**
 * Flow control function. Controls the authorization code request as well as the token exchange request.
 *
 * @throws BulkyError, OauthError, RequestError
 */
export async function generateTokenPair() {
	const authCodeResponse = await getAuthorizationCode()
	return await exchangeCodeForTokens(authCodeResponse)
}

/**
 * Redeem a refresh token to generate a new token pair.
 */
export async function redeemRefreshToken(refreshToken: string) {
	// compute the config for the request
	const payload = new URLSearchParams({
		client_id: import.meta.env.VITE_CLIENT_ID,
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	})

	// compute the config for the request
	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': import.meta.env.VITE_USER_AGENT,
		},
	}

	// execute the token exchange request
	try {
		const response = await axios.post<OauthTokenResponse>(tokenExchangeUrl, payload, config)
		return response.data
	} catch (e) {
		throw e
	}
}

/**
 * Compute the authorization code url that will be opened in an external browser.
 */
export function computeAuthorizationCodeUrl() {
	// calculate the relevant query parameters
	const scopes: AccountScope[] = ['account:profile', 'account:stashes']
	const params = {
		clientId: import.meta.env.VITE_CLIENT_ID,
		scope: scopes.join(' '),
		redirectUrl: import.meta.env.VITE_BASE_REDIRECT_URL,
		state: authorizationState,
		codeChallenge: generateCodeChallenge(),
	}

	// compute the authorization url
	return encodeURI(
		`${authorizationCodeBaseUrl}?client_id=${params.clientId}&response_type=code&scope=${params.scope}&state=${params.state}&redirect_uri=${params.redirectUrl}&code_challenge=${params.codeChallenge}&code_challenge_method=S256`
	)
}

/**
 * Implement the steps necessary for the authorization code request.
 *
 * @throws BulkyError, OauthError, RequestError
 */
async function getAuthorizationCode() {
	// Compute the authorization url.
	const authorizationCodeUrl = computeAuthorizationCodeUrl()

	// Server running means the login flow was not completed. The external oauth window was maybe closed.
	// Since we have no control over it and thus don't know, open it again.
	// We do know that the previous promise still hasn't settled, otherwise the port would be open again. Return an error here.
	// When the login process is eventually completed, it will trigger the initial promise and the flow will continue there.
	if (serverRunning) {
		openExternalBrowserWindow(authorizationCodeUrl)
		throw new RequestError({
			code: 'duplicate_request',
			message: 'This request is already in progress',
			status: 400,
		})
	}

	// Try to start the server and, if successful, open an external browser window for the login flow.
	const { app, server } = await startOauthRedirectServer()
	serverRunning = true
	// open the login page
	openExternalBrowserWindow(authorizationCodeUrl)
	const response = await registerOauthCallbackRoute(app, server)
	return response
}

/**
 * Start a temporary server listening to the oauth redirect port.
 * Returns an error if the port is in use already.
 */
export function startOauthRedirectServer() {
	const app = express()
	const port = 7149

	return new Promise((resolve: (res: { server: Server; app: Express }) => void, reject) => {
		const server = app.listen(port)
		let retryCount = 2
		const duration = 1500

		// Resolve the promise if the server can successfully listen to the port.
		server.on('listening', () => {
			console.log('Auth redirection server listening on port ' + port)
			resolve({ server, app })
		})

		// Retry twice in case of error, afterwards reject the promise.
		server.on('error', (error: RequestError) => {
			if (error.code === 'EADDRINUSE') {
				retryCount--

				if (retryCount >= 0) {
					setTimeout(() => {
						server.listen(port)
					}, duration)
				} else {
					reject(
						new RequestError({
							code: 'port_unavailable',
							message: 'Redirect server could not be started. Port unavailable.',
							status: 400,
						})
					)
				}
			} else {
				reject(
					new BulkyError({
						message: error.message ?? 'Unknown error during temp server setup',
					})
				)
			}
		})
	})
}

/**
 * Register a single route that returns a promise when it is being invoked.
 * If invoked with code and state query parameters, the flow will continue.
 * If invoked otherwise, the flow will stop and an error will be thrown.
 * Either way, when the route is being invoked, close the server connection.
 */
function registerOauthCallbackRoute(app: Express, server: Server) {
	return new Promise((resolve: (res: OauthAuthorizationCodeResponse) => void, reject) => {
		// Once this path gets triggered, extract the code, send it to the renderer and close the server.
		app.get('/oauth2redirect/poe', (req, res) => {
			// Close the server and reset state variables.
			server.close()
			serverRunning = false

			// If the response has the necessary query parameters, continue the flow. Else, cancel and reject.
			if ('code' in req.query && 'state' in req.query) {
				res.sendFile(redirectSuccessUrl)
				const successQuery = req.query as OauthAuthorizationCodeResponse
				resolve(successQuery)
			} else {
				res.sendFile(redirectErrorUrl)
				const errorQuery = req.query as OauthRedirectErrorQueryParameters
				reject(
					new OauthError({
						code: errorQuery.error,
						state: errorQuery.state,
						message: errorQuery.error_description ?? errorQuery.error,
					})
				)
			}
		})
	})
}

export function openAuthorizationCodeUrlManually() {
	if (!serverRunning) {
		throw new OauthError({
			code: 'redirect_server_unavailable',
			message: 'The redirect server is currently not running.',
			state: authorizationState,
		})
	}

	const authorizationCodeUrl = computeAuthorizationCodeUrl()
	openExternalBrowserWindow(authorizationCodeUrl)
}

/**
 * Consume a successful authorization code response and exchange it for a token pair.
 */
export async function exchangeCodeForTokens(authCodeResponse: OauthAuthorizationCodeResponse) {
	// check if the state is identical
	if (authCodeResponse.state !== authorizationState) {
		throw new OauthError({
			code: 'state_mismatch',
			message: 'The received state is not identical to the one generated.',
			state: authCodeResponse.state,
		})
	}

	// check if we have a code verifier
	if (!codeVerifier) {
		throw new OauthError({
			code: 'code_verifier_undefined',
			message: 'The code verifier is undefined',
			state: authCodeResponse.state,
		})
	}

	// compute the payload for the request
	const scopes: AccountScope[] = ['account:profile', 'account:stashes']
	const payload = new URLSearchParams({
		client_id: import.meta.env.VITE_CLIENT_ID,
		grant_type: 'authorization_code',
		code: authCodeResponse.code,
		redirect_uri: import.meta.env.VITE_BASE_REDIRECT_URL,
		scope: scopes.join(' '),
		code_verifier: codeVerifier,
	})

	// compute the config for the request
	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': import.meta.env.VITE_USER_AGENT,
		},
	}

	// execute the token exchange request
	const response = await axios.post<OauthTokenResponse>(tokenExchangeUrl, payload, config)

	return response.data
}

/** Consume a base64 encoded string and transform it into a url-safe format. */
function base64urlEncode(str: string) {
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Hash the output of the codeVerifier variable and transform it into a base 64 url-encoded string. */
function generateCodeChallenge() {
	if (codeVerifier === undefined) {
		codeVerifier = generateCodeVerifier()
	}

	return base64urlEncode(createHash('sha256').update(codeVerifier).digest('base64'))
}

/**
 * Generate a random 32 byte sequence and transform it into a base 64 url-encoded string.
 */
function generateCodeVerifier() {
	const buffer = randomBytes(32)
	return base64urlEncode(buffer.toString('base64'))
}

/**
 * Send a GGG token response to our backend to sign it.
 * This signed response jwt will be used to authorize further requests.
 */
export async function signTokenResponse(tokenResponse: SignableTokenStructure) {
	const server: string | undefined = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new Error('Server Url not found.')
	}

	const response = await axios.post<string>(`${server}/oauth/sign-ggg-token-response`, tokenResponse)

	// This will be the signed token
	if (response.status === 200) {
		return response.data
	}

	throw new Error(response.data)
}

export async function getRefreshToken(bulkyJwt: string) {
	const server: string | undefined = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new Error('Server Url not found.')
	}

	const response = await axios.get<string>(`${server}/oauth/get-refresh-token`, {
		headers: {
			Authorization: `Bearer ${bulkyJwt}`,
		},
	})

	// This will be the refresh token
	if (response.status === 200) {
		return response.data
	}

	throw new Error(response.data)
}
