import { AppUpdateStatus } from '@shared/types/electron.types'
import { WebContents } from 'electron'
import { ProgressInfo } from 'electron-updater'

/**
 * Send a message to the renderer to display the attachment panel.
 * @param {number} time Time in ms. Default is 2500
 */
function showAttachmentPanel(webContents: WebContents, time: number = 2500) {
	webContents.send('show-attachment-panel', { time })
}

/**
 * Instruct the renderer to display the app update panel.
 */
function showAppUpdatePanel(webContents: WebContents, status: AppUpdateStatus, info?: ProgressInfo, error?: Error) {
	webContents.send('show-app-update-panel', status, info, error)
}

/**
 * Toggle the overlay vue component on or off
 */
function toggleOverlayComponent(webContents: WebContents, showOverlay: boolean) {
	webContents.send('toggle-overlay-component', showOverlay)
}

/**
 * Send an oauth authorization code to the renderer
 */
function sendOauthAuthorizationCode(webContents: WebContents, code: string) {
	webContents.send('send-oauth-authorization-code', { code })
}

export const mainToRendererEvents = {
	showAttachmentPanel,
	showAppUpdatePanel,
	toggleOverlayComponent,
	sendOauthAuthorizationCode,
}
