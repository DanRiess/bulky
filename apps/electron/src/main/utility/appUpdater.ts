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

	// If an update cannot be found or an error occurs, just return to the app without ever showing the update panel.
	// Only show the panel when the download starts.
	return new Promise<boolean>((resolve, reject) => {
		autoUpdater.on('update-not-available', () => {
			console.log('update not available')
			// mainToRendererEvents.showAppUpdatePanel(webContents, 'UPDATE_NOT_FOUND')
			resolve(true)
		})

		autoUpdater.on('update-available', () => {
			console.log('update available')
			mainToRendererEvents.showAppUpdatePanel(webContents, 'UPDATE_FOUND')
			autoUpdater.downloadUpdate()
		})

		autoUpdater.on('download-progress', info => {
			console.log('downloading...')
			mainToRendererEvents.showAppUpdatePanel(webContents, 'DOWNLOADING_UPDATE', info)
		})

		autoUpdater.on('update-downloaded', () => {
			console.log('downloaded')
			mainToRendererEvents.showAppUpdatePanel(webContents, 'SUCCESS')

			setTimeout(() => {
				autoUpdater.quitAndInstall(true, true)
			}, 1000)
		})

		autoUpdater.on('error', error => {
			console.log('error during update')
			mainToRendererEvents.showAppUpdatePanel(webContents, 'ERROR', undefined, error)
			reject()
		})

		autoUpdater.checkForUpdates()
	})
}
