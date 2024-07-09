import { mainToRendererEvents } from '@main/events/mainToRenderer'
import { WebContents } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

export async function updateApp(webContents: WebContents) {
	if (import.meta.env.DEV) {
		autoUpdater.forceDevUpdateConfig = true
		autoUpdater.updateConfigPath = join(__dirname, '../../dev-app-update.yml')
	}

	mainToRendererEvents.showAttachmentPanel(webContents)

	return new Promise<boolean>(resolve => {
		autoUpdater.on('checking-for-update', () => {
			console.log('checking for update')
		})

		autoUpdater.on('update-not-available', info => {
			console.log('not available')
			console.log({ info })
			resolve(true)
		})

		autoUpdater.checkForUpdates()
	})
}
