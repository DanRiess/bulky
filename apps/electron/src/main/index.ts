import { app, ipcMain } from 'electron'
import { electronApp } from '@electron-toolkit/utils'
import { GameWindow } from './window/gameWindow'
import { OverlayWindow } from './window/overlayWindow'
import { registerInputs } from './inputs/registerInputs'
import { Chatbox } from './inputs/chatbox'
import { typeInChat } from './ipcCallbacks/typeInChat'
import { readConfig, writeConfig } from './ipcCallbacks/configActions'
import { BulkyConfig } from '@shared/types/config.types'
import { readStashTabs, writeStashTabs } from './ipcCallbacks/stashTabActions'
import { resolve } from 'path'
import { OverlayController } from 'electron-overlay-window'
import {
	computeAuthorizationCodeUrl,
	generateTokenPair,
	openAuthorizationCodeUrlManually,
	redeemRefreshToken,
} from './utility/oauth'
import { SerializedError } from '@shared/errors/serializedError'
import axios from 'axios'
import { NinjaCurrencyDto, NinjaItemDto } from '@shared/types/ninja.types'
import { PoeStashTab } from '@shared/types/poe.types'

// Initialize the app.
// This setup provides deep-linking and the option to open bulky from the browser during oauth flow.
// let deeplinkingUrl: string | undefined

if (import.meta.env.DEV && process.platform === 'win32') {
	// Set the path of electron.exe and your app.
	// These two additional parameters are only available on windows.
	// Setting this is required to get this working in dev mode.
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

	// register ipc handlers (bidirectional with return values)
	/** start the oauth flow to generate a token pair */
	ipcMain.handle('generate-oauth-tokens', async () => {
		try {
			return await generateTokenPair()
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/** manually open the authorization code url in case it doesn't happen automatically */
	ipcMain.handle('open-authorization-code-url', () => {
		try {
			return openAuthorizationCodeUrlManually()
		} catch (e) {
			return new SerializedError(e)
		}
	})

	/** get the authorization code url to copy to clipboard */
	ipcMain.handle('get-authorization-code-url', () => computeAuthorizationCodeUrl())

	/** return the league static json file */
	ipcMain.handle('get-leagues', async () => {
		try {
			return await import('../../resources/leagues.json')
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
	ipcMain.on('bye', () => console.log('bye'))

	// fixes a transparency issue in linux
	// https://github.com/electron/electron/issues/25153#issuecomment-871345288
	if (process.platform === 'linux') {
		app.commandLine.appendSwitch('use-gl', 'desktop')
	}

	setTimeout(
		() => {
			const poeWindow = new GameWindow()
			const overlayWindow = new OverlayWindow(poeWindow)
			const chatbox = new Chatbox(overlayWindow)
			overlayWindow.loadAppPage()

			registerInputs(overlayWindow)

			ipcMain.on('close-overlay', () => {
				overlayWindow.assertGameActive()
			})

			ipcMain.handle('type', (_, message: string) => typeInChat(message, chatbox))

			ipcMain.on('write-config', (_, config: BulkyConfig) => writeConfig(app, config))
			ipcMain.handle('read-config', () => readConfig(app))

			ipcMain.on('write-stash-tabs', (_, stashTabs: PoeStashTab[]) => writeStashTabs(app, stashTabs))
			ipcMain.handle('read-stash-tabs', () => readStashTabs(app))

			ipcMain.handle('redeem-refresh-token', (_, refreshToken: string) => redeemRefreshToken(refreshToken))

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
					overlayWindow.assertOverlayActive()
				}, 50)
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
