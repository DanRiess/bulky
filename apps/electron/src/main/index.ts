import { app, ipcMain } from 'electron'
import { electronApp } from '@electron-toolkit/utils'
import { GameWindow } from './window/gameWindow'
import { OverlayWindow } from './window/overlayWindow'
import { handleHello } from './ipcCallbacks/hello'
import { registerInputs } from './inputs/registerInputs'
import { Chatbox } from './inputs/chatbox'
import { typeInChat } from './ipcCallbacks/typeInChat'
import { readConfig, writeConfig } from './ipcCallbacks/configActions'
import { BulkyConfig } from '@shared/types/config.types'
import { readStashTabs, writeStashTabs } from './ipcCallbacks/stashTabActions'
import { StashTab } from '@shared/types/stash.types'
import { startOauthRedirectServer } from './utility/oauthServer'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('bulky.poe')

	console.log(process.versions)

	// app.on('activate', function () {
	// 	// On macOS it's common to re-create a window in the app when the
	// 	// dock icon is clicked and there are no other windows open.
	// 	if (BrowserWindow.getAllWindows().length === 0) createWindow()
	// })

	// register ipc handlers (bidirectional with return values)
	ipcMain.handle('hello', handleHello)

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

			ipcMain.on('write-stash-tabs', (_, stashTabs: StashTab[]) => writeStashTabs(app, stashTabs))
			ipcMain.handle('read-stash-tabs', () => readStashTabs(app))

			ipcMain.on('start-oauth-redirect-server', () => startOauthRedirectServer(overlayWindow.getWindow().webContents))
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
