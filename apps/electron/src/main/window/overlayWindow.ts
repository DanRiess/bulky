/**
 * This component is based on https://github.com/SnosMe/awakened-poe-trade/blob/master/main/src/windowing/OverlayWindow.ts
 */

import { join } from 'path'
import { BrowserWindow, dialog, shell, Menu } from 'electron'
import { AttachEvent, OverlayController } from 'electron-overlay-window'
import type { GameWindow } from './gameWindow'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import { mainToRendererEvents } from '../events/mainToRenderer'
import activeWindow from 'active-win'

// const noAttachMode = import.meta.env.VITE_NO_ATTACH_MODE === 'true' && is.dev

export class OverlayWindow {
	public enforceOverlay = false
	public isInteractable = false
	private window: BrowserWindow
	private ignoreNextFocus = false
	private ignoreNextBlur = false

	constructor(private poeWindow: GameWindow) {
		this.window = new BrowserWindow({
			...(process.platform === 'linux' && { icon }),
			title: import.meta.env.VITE_APP_TITLE,
			width: 800,
			height: 600,
			webPreferences: {
				preload: join(__dirname, '../preload/index.js'),
				allowRunningInsecureContent: false,
				// webviewTag: true,
				spellcheck: false,
			},
			fullscreenable: true,
			skipTaskbar: true,
			frame: false,
			show: false,
			transparent: true,
			resizable: true,
			hasShadow: true,
			alwaysOnTop: false,
		})

		this.window.setMenu(Menu.buildFromTemplate([{ role: 'editMenu' }, { role: 'reload' }, { role: 'toggleDevTools' }]))

		// spyOnPathofexileCookies(this.window.webContents, proxy.cookiesForPoe)

		this.window.webContents.setWindowOpenHandler(details => {
			shell.openExternal(details.url)
			return { action: 'deny' }
		})

		// overlay window event listeners
		this.window.on('blur', () => {
			// if the focused window lies outside the game's bounds, just return
			// DOES NOT WORK and results in infinite blur/focus loop. don't know why.
			// if (focusedWindowOutsideGameBounds(poeWindow)) {
			// 	this.window.show()
			// 	return
			// }

			if (this.ignoreNextBlur) {
				this.ignoreNextBlur = false
				return
			}
			this.isInteractable = false
			this.handlePoeWindowActiveChange(this.poeWindow.isActive)
		})
		this.window.on('focus', () => {
			if (this.ignoreNextFocus) {
				this.ignoreNextFocus = false
				return
			}
			this.isInteractable = true
			this.handlePoeWindowActiveChange(this.poeWindow.isActive)
		})

		// poe window event listeners
		this.poeWindow.on('attach', this.handleOverlayAttached)
		this.poeWindow.on('poe-window-active-change', this.handlePoeWindowActiveChange)
	}

	public getWindow() {
		return this.window
	}

	public getBounds() {
		return this.window?.getBounds()
	}

	/**
	 * Load the overlay and attach it to the POE window
	 */
	public loadAppPage() {
		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		const url =
			is.dev && process.env['ELECTRON_RENDERER_URL']
				? process.env['ELECTRON_RENDERER_URL']
				: join(__dirname, '../../renderer/index.html')

		if (is.dev) {
			console.log(process.env['ELECTRON_RENDERER_URL'])
			this.window.loadURL(url)
			this.window.webContents.openDevTools({ mode: 'detach', activate: true })

			this.poeWindow.attach(this, import.meta.env.VITE_GAME_TITLE)
		} else {
			this.window.loadURL(url)
		}
	}

	/** activate the overlay. if the game is not currently focused, do nothing. */
	public assertOverlayActive = () => {
		if (!this.poeWindow.isActive) return

		this.ignoreNextFocus = true
		this.poeWindow.ignoreNextBlur = true
		this.isInteractable = true
		OverlayController.activateOverlay()
		this.poeWindow.isActive = false
		this.handlePoeWindowActiveChange(false)
	}

	/** activate the game. if the overlay is not currently focused, do nothing */
	public assertGameActive = () => {
		if (!this.isInteractable) return

		this.ignoreNextBlur = true
		this.poeWindow.ignoreNextFocus = true
		this.isInteractable = false
		OverlayController.focusTarget()
		this.poeWindow.isActive = true
		this.handlePoeWindowActiveChange(true)
	}

	public assertAllInactive = () => {
		this.isInteractable = false
		this.poeWindow.isActive = false
		this.handlePoeWindowActiveChange(false)
	}

	/** toggle between the game and the overlay */
	public toggleActiveState = () => {
		if (this.isInteractable) {
			this.assertGameActive()
		} else {
			// only allow toggling the overlay if PoE is the focused window
			const activeWin = activeWindow.sync()
			if (activeWin?.title.match(import.meta.env.VITE_GAME_TITLE)) {
				this.assertOverlayActive()
			}
		}
	}

	/**
	 * this function in PoeAT gets called from an event that fires in onMounted in the vue overlay component.
	 * depending on how we implement the config and where we load it from, this might not be necessary.
	 */
	public updateOpts(overlayKey: string, windowTitle: string) {
		// this.overlayKey = overlayKey
		console.log(overlayKey)
		this.poeWindow.attach(this, windowTitle)
	}

	/**
	 * The constructor in this class instantiates an 'attach' event listener in GameWindow.
	 * That event gets triggered after the overlay is attached to the game.
	 * The event then uses this function as callback and errors if the game is started in admin mode.
	 */
	private handleOverlayAttached = (event: AttachEvent) => {
		if (event.hasAccess === false) {
			// this.logger.write('error [Overlay] PoE is running with administrator rights')

			dialog.showErrorBox(
				'PoE window - No access',
				// ----------------------
				'Path of Exile is running with administrator rights.\n' +
					'\n' +
					'You need to restart Awakened PoE Trade with administrator rights.'
			)
		} else {
			if (!this.window) return
			mainToRendererEvents.showAttachmentPanel(this.window.webContents, 2500)
		}
	}

	/**
	 * Pipe function that asserts that the POE window and the overlay are never active at the same time.
	 * Used as a callback for focus / blur events from both overlay and POE window.
	 * Dispatches a toggle event to the renderer.
	 */
	private handlePoeWindowActiveChange = (poeWindowActive: boolean) => {
		// console.log('active state changed')
		// console.log({
		// 	enforcedOverlay: this.enforceOverlay,
		// 	poeWindowActive,
		// 	overlayInteract: this.isInteractable,
		// })
		// check if overlay should stay visible no matter what
		if (this.enforceOverlay) {
			mainToRendererEvents.toggleOverlayComponent(this.window.webContents, true, false)
			return
		}

		// handle case where PoeWindow and Overlay are active at the same time
		if (poeWindowActive && this.isInteractable) {
			this.isInteractable = false
		}

		// this.window.webContents.send('active-change', { gameActive: isActive, overlayActive: this.isInteractable })
		mainToRendererEvents.toggleOverlayComponent(this.window.webContents, this.isInteractable, poeWindowActive)
	}
}

// function spyOnPathofexileCookies(webContents: WebContents, map: Map<string, string>) {
// 	const urls = PROXY_HOSTS.filter(({ official }) => official).map(({ host }) => `https://${host}/*`)

// 	webContents.session.webRequest.onHeadersReceived({ urls }, (details, next) => {
// 		for (const key in details.responseHeaders) {
// 			if (key.toLowerCase() === 'set-cookie') {
// 				for (const cookie of details.responseHeaders[key]) {
// 					const [key, value] = cookie.split(';', 1)[0].split('=', 2)
// 					map.set(key, value)
// 				}
// 				break
// 			}
// 		}
// 		next({ responseHeaders: details?.responseHeaders })
// 	})

// 	webContents.session.webRequest.onBeforeSendHeaders({ urls }, (details, next) => {
// 		for (const key in details.requestHeaders) {
// 			if (key.toLowerCase() === 'cookie') {
// 				for (const part of details.requestHeaders[key].split(';')) {
// 					const [key, value] = part.trim().split('=', 2)
// 					map.set(key, value)
// 				}
// 				break
// 			}
// 		}
// 		next({ requestHeaders: details.requestHeaders })
// 	})
// }
