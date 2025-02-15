import { app, ipcMain, session } from 'electron'
import { electronApp } from '@electron-toolkit/utils'
import { GameWindow } from './window/gameWindow'
import { OverlayWindow } from './window/overlayWindow'
import { registerInputs } from './inputs/registerInputs'
import { Chatbox } from './inputs/chatbox'
import { readConfig, writeConfig } from './ipcCallbacks/configActions'
import { BulkyConfig } from '@shared/types/config.types'
import path, { resolve } from 'path'
import { OverlayController } from 'electron-overlay-window'
import {
	computeAuthorizationCodeUrl,
	generateTokenPair,
	getRefreshToken,
	openAuthorizationCodeUrlManually,
	redeemRefreshToken,
	signTokenResponse,
} from './utility/oauth'
import { SerializedError } from '@shared/errors/serializedError'
import axios from 'axios'
import { NinjaCurrencyDto, NinjaItemDto } from '@shared/types/ninja.types'
import { updateApp } from './utility/appUpdater'
import { ClientDotTxt } from './utility/clientDotTxt'
import { BulkyBazaarOfferDto, Category } from '@shared/types/bulky.types'
import { getOffers, putOffer } from './ipcCallbacks/offers'
import { SignableTokenStructure } from '@shared/types/auth.types'
import { mainToRendererEvents } from './events/mainToRenderer'
import activeWindow from 'active-win'
import { openExternalBrowserWindow } from './utility/openExternalBrowserWindow'
import { AppStateStore } from './stores/appStateStore'

// STATE
let checkedForUpdate = false

// Initialize the app.
if (import.meta.env.DEV && process.platform === 'win32') {
	// Set the path of electron.exe and your app.
	// These two additional parameters are only available on windows.
	// Setting this is required to get it working in dev mode.
	app.setAsDefaultProtocolClient('bulky', process.execPath, [resolve(process.argv[1])])
} else {
	app.setAsDefaultProtocolClient('bulky')
}

// Force single instance application
const gotTheLock = app.requestSingleInstanceLock()

// A second instance is being requested.
// Block it from creating an entirely new instance.
// A method that is being triggered within the main instance is in the settimeout function below,
// because it needs access to the window controllers.
if (!gotTheLock) {
	app.quit()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('bulky.poe')

	// app.on('activate', function () {
	// 	// On macOS it's common to re-create a window in the app when the
	// 	// dock icon is clicked and there are no other windows open.
	// 	if (BrowserWindow.getAllWindows().length === 0) createWindow()
	// })

	// Register ipc handlers (bidirectional with return values).

	ipcMain.on('open-external-browser-window', (_, url: string) => openExternalBrowserWindow(url))

	/**
	 * Return the currently active window.
	 * Can be used to determine if a stash tab request to the GGG servers should be made.
	 */
	ipcMain.handle('get-active-window', async () => {
		return await activeWindow()
	})

	/**
	 * Write the config file.
	 */
	ipcMain.on('write-config', (_, config: BulkyConfig) => writeConfig(app, config))

	/**
	 * Read the config file
	 */
	ipcMain.handle('read-config', () => readConfig(app))

	/**
	 * Start the oauth flow to generate a token pair .
	 */
	ipcMain.handle('generate-oauth-tokens', async () => {
		try {
			return await generateTokenPair()
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/**
	 * Manually open the authorization code url in case it doesn't happen automatically.
	 */
	ipcMain.handle('open-authorization-code-url', () => {
		try {
			return openAuthorizationCodeUrlManually()
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/**
	 * Get the authorization code url to copy to clipboard.
	 */
	ipcMain.handle('get-authorization-code-url', () => computeAuthorizationCodeUrl())

	/**
	 * Sign the received ggg oauth token response.
	 */
	ipcMain.handle('sign-token-response', (_, tokenResponse: SignableTokenStructure) => {
		try {
			return signTokenResponse(tokenResponse)
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/**
	 * Get the saved refresh token if it is available.
	 */
	ipcMain.handle('get-refresh-token', (_, bulkyJwt: string) => {
		try {
			return getRefreshToken(bulkyJwt)
		} catch (e) {
			return new SerializedError(e)
		}
	})

	ipcMain.handle('hello', () => {
		console.log('this is fine')
		return 'hello'
	})

	/**
	 * Redeem a refresh token to generate a new AT/RT pair.
	 */
	ipcMain.handle('redeem-refresh-token', async (_, refreshToken: string) => {
		try {
			return await redeemRefreshToken(refreshToken)
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/**
	 * Return the league static json file
	 */
	ipcMain.handle('get-leagues', async () => {
		try {
			const res = await axios.get('https://pathofexile.com/api/leagues', {
				headers: {
					'User-Agent': import.meta.env.VITE_USER_AGENT,
				},
			})
			return res.data
		} catch (e) {
			console.log(e)
			return new SerializedError(e)
		}
	})

	/**
	 * Put an offer to the bulky server.
	 */
	ipcMain.handle('put-offer', async (_, offerDto: BulkyBazaarOfferDto, jwt: string) => {
		try {
			return await putOffer(offerDto, jwt)
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/**
	 * Get a poe.ninja category.
	 */
	ipcMain.handle('get-ninja-category', async (_, url) => {
		try {
			const res = await axios.get<Record<'lines', NinjaCurrencyDto[] | NinjaItemDto[]>>(url)
			return res.data
		} catch (e) {
			return new SerializedError(e)
		}
	})

	// register ipc handlers (one way, no return values)
	// ipcMain.on('bye', () => console.log('bye'))

	// fixes a transparency issue in linux
	// https://github.com/electron/electron/issues/25153#issuecomment-871345288
	if (process.platform === 'linux') {
		app.commandLine.appendSwitch('use-gl', 'desktop')
	}

	// Instatiate the app state store.
	const appStateStore = AppStateStore.instance

	setTimeout(
		() => {
			// Initialize instances.
			const poeWindow = new GameWindow()
			const overlayWindow = new OverlayWindow(poeWindow)
			const chatbox = new Chatbox(overlayWindow, poeWindow)

			// Load the app page.
			overlayWindow.loadAppPage()

			// Register input events.
			registerInputs(overlayWindow)

			// Start the client.txt watcher
			new ClientDotTxt(
				path.join(path.normalize('/Program Files (x86)/Grinding Gear Games/Path of Exile'), 'logs', 'Client.txt'),
				overlayWindow.window.webContents
			)

			// Register listeners
			ipcMain.on('close-overlay', () => {
				overlayWindow.hideOverlay()
			})

			ipcMain.handle('type', (_, message: string) => chatbox.type(message))
			ipcMain.on('paste-search', (_, message: string) => chatbox.search(message))

			ipcMain.on('set-ignore-mouse-events', (_, ignore) => overlayWindow.ignoreMouseEvents(ignore))

			/**
			 * Get offers of the provided category and league from the server.
			 * Will only download if either the game or the overlay are in focus.
			 */
			ipcMain.handle('get-offers', async (_, category: Category, league: string, timestamp: number) => {
				try {
					return await getOffers(category, league, timestamp, overlayWindow)
				} catch (e) {
					return new SerializedError(e)
				}
			})

			// A second instance is being requested.
			// This happens for example during the oauth flow when the browser window attempts to redirect to the app.
			// app.on('second-instance', (_, argv) => {
			app.on('second-instance', () => {
				if (process.platform === 'win32') {
					// find the argument that is the custom protocol url and store it
					// deeplinkingUrl = argv.find(arg => arg.startsWith('bulky://'))
				}

				// focus the game, give the focus controller time to trigger, then focus the overlay
				OverlayController.focusTarget()
				setTimeout(() => {
					overlayWindow.focusOverlayWindow()
					overlayWindow.showOverlay()
				}, 50)
			})

			// Set the CSP.
			session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
				callback({
					responseHeaders: {
						...details.responseHeaders,
						'Content-Security-Policy': [
							"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src https://www.pathofexile.com https://api.pathofexile.com ws://localhost:5173 http://localhost:5173 ws://localhost:5174 http://localhost:5174 https://poe.ninja; img-src 'self' http://localhost:5174 https://web.poecdn.com",
						],
					},
				})
			})

			// Handle the update process
			overlayWindow.window.webContents.on('did-finish-load', async () => {
				if (checkedForUpdate) return
				checkedForUpdate = true

				// Try to update the app
				// When this needs to be reenabled, also change overlayWindow.show to true
				try {
					await updateApp(overlayWindow.window.webContents)
				} catch (e) {
					mainToRendererEvents.showAppUpdatePanel(overlayWindow.window.webContents, 'ERROR')
				}

				// Attach the controller.
				poeWindow.attach(overlayWindow, appStateStore.gameWindowTitle)
			})
		},
		process.platform === 'linux' ? 1000 : 0
	)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// deep linking open url
// app.on('open-url', (e, url) => {
app.on('open-url', e => {
	e.preventDefault()
	// deeplinkingUrl = url
})
