import {
	AccountScope,
	OauthAuthorizationCodeResponse,
	OauthCustomError,
	OauthCustomErrorParameters,
	OauthError,
	OauthErrorResponse,
	OauthRedirectErrorQueryParameters,
	OauthTokenResponse,
} from '@shared/types/auth.types'
import express, { Express } from 'express'
import { Server } from 'http'
import { openExternalBrowserWindow } from './openExternalBrwoserWindow'
import { randomBytes, createHash } from 'crypto'
import { v4 } from 'uuid'
import axios from 'axios'
import redirectErrorUrl from '../../../resources/redirectError.html?asset'
import redirectSuccessUrl from '../../../resources/redirectSuccess.html?asset'

interface ResponseError extends Error {
	code?: string
}

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
 */
export async function generateTokenPair() {
	const authCodeResponse = await getAuthorizationCode()

	if ('error' in authCodeResponse) {
		console.log('error in auth code response')
		return authCodeResponse
	}

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
		if (e instanceof OauthError) {
			return generateResponseFromError(e)
		}
		return generateResponseFromError(new OauthCustomError({ error: 'unknown', error_description: 'Unknown error' }))
	}
}

/**
 * Implement the steps necessary for the authorization code request.
 */
async function getAuthorizationCode() {
	console.log('starting oauth workflow')

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
	const authorizationCodeUrl = `${authorizationCodeBaseUrl}?client_id=${params.clientId}&response_type=code&scope=${params.scope}&state=${params.state}&redirect_uri=${params.redirectUrl}&code_challenge=${params.codeChallenge}&code_challenge_method=S256`

	// Server running means the login flow was not completed. The external oauth window was maybe closed.
	// Since we have no control over it and thus don't know, open it again.
	// We do know that the previous promise still hasn't settled, otherwise the port would be open again. Return an error here.
	// When the login process is eventually completed, it will trigger the initial promise and the flow will continue there.
	if (serverRunning) {
		console.log('server is already up and running')
		openExternalBrowserWindow(authorizationCodeUrl)
		return generateResponseFromError(
			new OauthCustomError({ error: 'request_in_progess', error_description: 'Request in progress' })
		)
	}

	// try to start the server and, if successful, open an external browser window for the login flow
	try {
		console.log('start server')
		const { app, server } = await startOauthRedirectServer()
		serverRunning = true
		// open the login page
		openExternalBrowserWindow(authorizationCodeUrl)
		const response = await registerOauthCallbackRoute(app, server)
		return response
	} catch (e: unknown) {
		if (e instanceof OauthError || e instanceof OauthCustomError) {
			return generateResponseFromError(e)
		}
		return generateResponseFromError(new OauthCustomError({ error: 'unknown', error_description: 'Unknown error' }))
	}
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

		// resolve the promise if the server can successfully listen to the port
		server.on('listening', () => {
			console.log('Auth redirection server listening on port ' + port)
			resolve({ server, app })
		})

		// retry twice in case of error, afterwards reject the promise
		server.on('error', (error: ResponseError) => {
			if (error.code === 'EADDRINUSE') {
				retryCount--

				if (retryCount >= 0) {
					setTimeout(() => {
						server.listen(port)
					}, duration)
				} else {
					const errorParams: OauthCustomErrorParameters = {
						error: 'port_unavailable',
						error_description: 'Redirect server could not be started. Port unavailable.',
					}
					reject(new OauthCustomError(errorParams))
				}
			}

			reject(new OauthCustomError({ error: 'unknown', error_description: 'Unknown error during temp server setup' }))
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
				reject(new OauthError(errorQuery))
			}
		})
	})
}

/**
 * Consume a successful authorization code response and exchange it for a token pair.
 */
export async function exchangeCodeForTokens(authCodeResponse: OauthAuthorizationCodeResponse) {
	// check if the state is identical
	if (authCodeResponse.state !== authorizationState) {
		console.log({ received: authCodeResponse.state, authorizationState })
		return generateResponseFromError(
			new OauthCustomError({
				error: 'state_mismatch',
				error_description: 'The received state is not identical to the one generated.',
			})
		)
	}

	// check if we have a code verifier
	if (!codeVerifier) {
		return generateResponseFromError(
			new OauthCustomError({
				error: 'code_verifier_undefined',
				error_description: 'The code verifier is undefined.',
			})
		)
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
	try {
		const response = await axios.post<OauthTokenResponse>(tokenExchangeUrl, payload, config)

		return response.data
	} catch (e) {
		console.log(e)
		return generateResponseFromError(new OauthCustomError({ error: 'unknown', error_description: 'Unknown error' }))
	}
}

/**
 * Consume an error that has been thrown at any point in the oauth flow and transform it to an object.
 * Errors lose their value when sent back to the renderer otherwise.
 */
function generateResponseFromError(e: OauthCustomError | OauthError) {
	const errorResponse: OauthErrorResponse = {
		error: e.error,
		description: e.description,
		state: e.state,
	}
	return errorResponse
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

/** Generate a random 32 byte sequence and transform it into a base 64 url-encoded string. */
function generateCodeVerifier() {
	const buffer = randomBytes(32)
	return base64urlEncode(buffer.toString('base64'))
}
