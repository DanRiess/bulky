import { WebContents } from 'electron'

/**
 * Send a message to the renderer to display the attachment panel.
 * @param {number} time Time in ms. Default is 2500
 */
function showAttachmentPanel(webContents: WebContents, time: number = 2500) {
	webContents.send('show-attachment-panel', { time })
}

/**
 * Toggle the overlay vue component on or off
 */
function toggleOverlayComponent(webContents: WebContents, overlayWindowActive: boolean, gameWindowActive: boolean) {
	webContents.send('toggle-overlay-component', { overlayWindowActive, gameWindowActive })
}

/**
 * Send an oauth authorization code to the renderer
 */
function sendOauthAuthorizationCode(webContents: WebContents, code: string) {
	webContents.send('send-oauth-authorization-code', { code })
}

export const mainToRendererEvents = {
	showAttachmentPanel,
	toggleOverlayComponent,
	sendOauthAuthorizationCode,
}
