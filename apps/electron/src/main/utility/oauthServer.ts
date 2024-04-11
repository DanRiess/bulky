import { mainToRendererEvents } from '../events/mainToRenderer'
import { WebContents } from 'electron'
import express from 'express'

interface ResponseError extends Error {
	code?: string
}

/**
 * Start a temporary server listening to the oauth redirect port and path.
 * Upon being triggered, extract the code, send it back to the renderer and close the server.
 */
export function startOauthRedirectServer(webContents: WebContents) {
	const app = express()
	const port = 7149

	return new Promise((resolve, reject) => {
		const server = app.listen(port)
		let retryCount = 2
		const duration = 1500

		// once this path gets triggered, extract the code, send it to the renderer and close the server
		app.get('/oauth2redirect/poe', (req, res) => {
			console.log(req.query)
			console.log(req.url)

			res.send().status(200)
			mainToRendererEvents.sendOauthAuthorizationCode(webContents, 'adsfwgxcbklsww8765aw')
			server.close()
		})

		// resolve the promise if the server can successfully listen to the port
		server.on('listening', () => {
			console.log('Auth redirection server listening on port ' + port)
			resolve(true)
		})

		// retry twice in case of error, afterwards reject the promise
		server.on('error', (error: ResponseError) => {
			if (error.code === 'EADDRINUSE') {
				retryCount--

				if (retryCount > 0) {
					setTimeout(() => {
						server.listen(port)
					}, duration)
				} else {
					reject(false)
				}
			}
		})
	})
}
