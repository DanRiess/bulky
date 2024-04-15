import {
	AccountScope,
	OauthCustomError,
	OauthCustomErrorParameters,
	OauthError,
	OauthErrorResponse,
	OauthRedirectErrorQueryParameters,
	OauthRedirectSuccess,
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
const authorizationCodeBaseUrl = 'https://pathofexile.com/oauth/authorize'
const tokenExchangeUrl = 'https://pathofexile.com/oauth/token'

export async function getOauthResponse() {
	const authCodeResponse = await getAuthorizationCode()

	if ('error' in authCodeResponse) {
		console.log('error in auth code response')
		return authCodeResponse
	}

	console.log({ authCodeResponse })

	await exchangeCodeForTokens(authCodeResponse)
}

export async function exchangeCodeForTokens(authCodeResponse: OauthRedirectSuccess) {
	// check if the state is identical
	if (authCodeResponse.state !== authorizationState) {
		console.log({ received: authCodeResponse.state, authorizationState })
		return new OauthCustomError({
			error: 'state_mismatch',
			error_description: 'The received state is not identical to the one generated.',
		})
	}

	if (!codeVerifier) return

	// get the data for the request
	const scopes: AccountScope[] = ['account:profile', 'account:stashes']
	// const data = {
	// 	client_id: import.meta.env.VITE_CLIENT_ID,
	// 	client_secret: '',
	// 	grant_type: 'authorization_code',
	// 	code: authCodeResponse.code,
	// 	redirect_uri: import.meta.env.VITE_BASE_REDIRECT_URL,
	// 	scope: scopes.join(' '),
	// 	code_verifier: codeVerifier,
	// }

	// // turn it into x-www-form-urlencoded format
	// const formBodyArray: string[] = []
	// for (const property in data) {
	// 	const encodedKey = encodeURIComponent(property)
	// 	const encodedValue = encodeURIComponent(data[property])
	// 	formBodyArray.push(`${encodedKey}=${encodedValue}`)
	// }
	// const formBody = formBodyArray.join('&')

	// console.log(formBody)
	// console.log(data.code, data.code_verifier)

	const data = new URLSearchParams({
		client_id: import.meta.env.VITE_CLIENT_ID,
		// client_secret: '',
		grant_type: 'authorization_code',
		code: authCodeResponse.code,
		redirect_uri: import.meta.env.VITE_BASE_REDIRECT_URL,
		scope: 'account:profile',
		code_verifier: codeVerifier,
	})

	console.log({ code: authCodeResponse.code, verifier: codeVerifier })

	// try {
	// 	const response = await axios.post(tokenExchangeUrl, data, {
	// 		headers: {
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 			'User-Agent': 'Oauth bulky/0.0.1 (contact: riess.dan@gmail.com) StrictMode',
	// 		},
	// 	})

	// 	return response
	// } catch (e) {
	// 	console.log(e)
	// 	return e
	// }
}

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

	console.log({ verifier: codeVerifier, challenge: params.codeChallenge })

	// compute the authorization url
	const authorizationCodeUrl = `${authorizationCodeBaseUrl}?client_id=${params.clientId}&response_type=code&scope=${params.scope}&state=${params.state}&redirect_uri=${params.redirectUrl}&code_challenge=${params.codeChallenge}&code_challenge_method=S256`

	// Server running means the login flow was not completed. The external oauth window was maybe closed.
	// Since we have no control over it and thus don't know, open it again.
	// We do know that the previous promise still hasn't settled, otherwise the port would be open again. Return an error here.
	// When the login process is eventually completed, it will trigger the previous promise actions.
	if (serverRunning) {
		console.log('server is already up and running')
		openExternalBrowserWindow(authorizationCodeUrl)
		return generateResponseFromError(
			new OauthCustomError({ error: 'request_in_progess', error_description: 'Request in progress' })
		)
	}

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
	return new Promise((resolve: (res: OauthRedirectSuccess) => void, reject) => {
		// Once this path gets triggered, extract the code, send it to the renderer and close the server.
		app.get('/oauth2redirect/poe', (req, res) => {
			// Close the server and reset state variables.
			server.close()
			serverRunning = false

			// If the response has the necessary query parameters, continue the flow. Else, cancel and reject.
			if ('code' in req.query && 'state' in req.query) {
				res.sendFile(redirectSuccessUrl)
				const successQuery = req.query as OauthRedirectSuccess
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
 * Takes an error that has been thrown at any point in the oauth flow and converts it to an object.
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

/** Hash the output of the codeVerifier variable and returns it. */
function generateCodeChallenge() {
	if (codeVerifier === undefined) {
		codeVerifier = generateCodeVerifier()
	}

	return createHash('sha256').update(codeVerifier).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Generate a random 32 byte sequence and return as base 64 string */
function generateCodeVerifier() {
	const buffer = randomBytes(32)
	return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
