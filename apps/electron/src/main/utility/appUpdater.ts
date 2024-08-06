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
	return new Promise<boolean>(resolve => {
		autoUpdater.on('checking-for-update', () => {
			// mainToRendererEvents.showAppUpdatePanel(webContents, 'CHECKING_FOR_UPDATE')
		})

		autoUpdater.on('update-not-available', () => {
			// mainToRendererEvents.showAppUpdatePanel(webContents, 'UPDATE_NOT_FOUND')
			resolve(true)
		})

		autoUpdater.on('update-available', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'UPDATE_FOUND')
			autoUpdater.downloadUpdate()
		})

		autoUpdater.on('download-progress', info => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'DOWNLOADING_UPDATE', info)
		})

		autoUpdater.on('update-downloaded', () => {
			mainToRendererEvents.showAppUpdatePanel(webContents, 'SUCCESS')

			// setTimeout(() => {
			// 	autoUpdater.quitAndInstall(true, true)
			// }, 1000)
		})

		autoUpdater.on('error', () => {
			console.log('error during update')
			// mainToRendererEvents.showAppUpdatePanel(webContents, 'ERROR', undefined, error)

			// This looks counter-intuitive.
			// However, if the update check errors, Bulky should start normally in its current version.
			// That's why rejecting is not necessary.
			resolve(true)
		})

		autoUpdater.checkForUpdates()
	})
}
