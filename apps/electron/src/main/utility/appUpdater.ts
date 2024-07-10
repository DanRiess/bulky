import { mainToRendererEvents } from '@main/events/mainToRenderer'
import { WebContents } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

/**
 * Handle the flow for updating the app.
 * Send events to the renderer for display.
 *
 * Handle the update process manually. The events get for some reason triggered multiple times.
 * This will lead to race conditions and multiple downloads.
 */
export function updateApp(webContents: WebContents) {
	// Configure the updater
	autoUpdater.disableWebInstaller = true
	autoUpdater.autoDownload = false
	autoUpdater.autoRunAppAfterInstall = true

	// Setup for development use.
	if (import.meta.env.DEV) {
		autoUpdater.forceDevUpdateConfig = true
		autoUpdater.updateConfigPath = join(__dirname, '../../dev-app-update.yml')
	}

	return new Promise<boolean>((resolve, reject) => {
		autoUpdater.on('checking-for-update', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'CHECKING')
		})

		autoUpdater.on('update-not-available', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'NOT_FOUND')
			resolve(true)
		})

		autoUpdater.on('update-available', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'FOUND')
			autoUpdater.downloadUpdate()
		})

		autoUpdater.on('download-progress', info => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'DOWNLOADING', info)
		})

		autoUpdater.on('update-downloaded', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'SUCCESS')
			// autoUpdater.quitAndInstall(true, true)
		})

		autoUpdater.on('error', (error, message) => {
			console.log(message)
			mainToRendererEvents.showAppUpdatePanel(webContents, 'ERROR', undefined, error)
			reject()
		})

		autoUpdater.checkForUpdates()
	})
}
