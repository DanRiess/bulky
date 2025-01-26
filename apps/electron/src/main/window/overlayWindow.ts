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
	private _window: BrowserWindow

	// private _focusedWindow: 'game' | 'overlay' | undefined = undefined
	private _showOverlay = false

	constructor(private poeWindow: GameWindow) {
		this._window = new BrowserWindow({
			...(process.platform === 'linux' && { icon }),
			title: import.meta.env.VITE_APP_TITLE,
			width: 350,
			height: 400,
			webPreferences: {
				preload: join(__dirname, '../preload/index.js'),
				allowRunningInsecureContent: false,
				// webviewTag: true,
				spellcheck: false,
			},
			fullscreenable: true,
			// focusable: false,
			skipTaskbar: true,
			frame: false,
			show: import.meta.env.VITE_NO_ATTACH_MODE !== 'true',
			transparent: true,
			resizable: true,
			hasShadow: true,
			alwaysOnTop: true,
		})

		this._window.setMenu(Menu.buildFromTemplate([{ role: 'editMenu' }, { role: 'reload' }, { role: 'toggleDevTools' }]))

		this._window.webContents.setWindowOpenHandler(details => {
			shell.openExternal(details.url)
			return { action: 'deny' }
		})

		this.poeWindow.on('attach', this.handleOverlayAttached)
		this.poeWindow.on('game-window-focused', async (focus: boolean) => {
			if (focus === false) {
				const activeWin = await activeWindow()
				if (activeWin?.title !== import.meta.env.VITE_APP_TITLE) {
					this.hideOverlay()
				}
			} else if (focus === true) {
				// If the overlay should be visible, focus it.
				// If not, setting the mouse ignore events ensures that the notifications button is responsive.
				this.overlayVisible ? this.focusOverlayWindow() : this.ignoreMouseEvents(true)
			}
		})
	}

	get overlayVisible() {
		return this._showOverlay
	}

	get window() {
		return this._window
	}

	/**
	 * Load the overlay.
	 */
	public loadAppPage() {
		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		const url =
			is.dev && process.env['ELECTRON_RENDERER_URL']
				? process.env['ELECTRON_RENDERER_URL']
				: join(__dirname, '../renderer/index.html')

		if (is.dev) {
			this._window.loadURL(url)
			this._window.webContents.openDevTools({ mode: 'detach', activate: true })
		} else {
			this._window.loadFile(url)
			// this._window.webContents.openDevTools({ mode: 'detach', activate: true })
		}
	}

	public ignoreMouseEvents(ignore: boolean) {
		// Never ignore mouse events if the overlay window is shown.
		if (this._showOverlay) {
			this._window.setIgnoreMouseEvents(false)
			return
		}
		this._window.setIgnoreMouseEvents(ignore, { forward: true })
	}

	public showOverlay() {
		this._showOverlay = true
		this._window.focus()
		this._window.focusOnWebView()
		this._window.moveAbove(this._window.getMediaSourceId())
		this._window.moveTop()
		mainToRendererEvents.toggleOverlayComponent(this._window.webContents, true)
		this.ignoreMouseEvents(false)
		// console.log('showoverlay', {
		// 	visible: this._window.isVisible(),
		// 	focusable: this._window.isFocusable(),
		// 	focused: this._window.isFocused(),
		// 	enabled: this._window.isEnabled(),
		// 	// missioncontrol: this._window.isHiddenInMissionControl(),
		// 	normal: this._window.isNormal(),
		// 	// visibleWorkspaces: this._window.isVisibleOnAllWorkspaces(),
		// })
	}

	public hideOverlay() {
		this._showOverlay = false
		// this._window.focus()
		mainToRendererEvents.toggleOverlayComponent(this._window.webContents, false)
		this.ignoreMouseEvents(true)
		// console.log('hide overlay', {
		// 	hidden: this._window.isVisible(),
		// 	focusable: this._window.isFocusable(),
		// 	focused: this._window.isFocused(),
		// })
	}

	public focusOverlayWindow() {
		OverlayController.activateOverlay()
		this.ignoreMouseEvents(false)
	}

	public focusGameWindow() {
		console.log('focus game')
		OverlayController.focusTarget()
		this.ignoreMouseEvents(true)
	}

	public toggleActiveState() {
		if (this._showOverlay) {
			this.focusGameWindow()
			this.hideOverlay()
		} else {
			this.focusOverlayWindow()
			this.showOverlay()
		}
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
				`${process.env.VITE_GAME_TITLE} window - No access`,
				`${process.env.VITE_GAME_TITLE} is running with administrator rights.
				Restart Bulky with administrator rights.`
			)
		} else {
			if (!this._window) return
			mainToRendererEvents.showAttachmentPanel(this._window.webContents, 1500)
			// this._showOverlay = true
			// mainToRendererEvents.toggleOverlayComponent(this._window.webContents, this._showOverlay)
		}
	}
}
