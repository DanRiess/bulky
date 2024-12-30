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
	private window: BrowserWindow

	// private _focusedWindow: 'game' | 'overlay' | undefined = undefined
	private _showOverlay = false

	constructor(private poeWindow: GameWindow) {
		this.window = new BrowserWindow({
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
			show: true,
			transparent: true,
			resizable: true,
			hasShadow: true,
			alwaysOnTop: true,
		})

		this.window.setMenu(Menu.buildFromTemplate([{ role: 'editMenu' }, { role: 'reload' }, { role: 'toggleDevTools' }]))

		this.window.webContents.setWindowOpenHandler(details => {
			shell.openExternal(details.url)
			return { action: 'deny' }
		})

		this.window

		this.poeWindow.on('attach', this.handleOverlayAttached)
		this.poeWindow.on('game-window-focused', async (focus: boolean) => {
			if (focus === false) {
				const activeWin = await activeWindow()
				console.log({ activeWin })
				if (activeWin?.title !== import.meta.env.VITE_APP_TITLE && !activeWin?.title.startsWith('Developer Tools -')) {
					this.hideOverlay()
				}
			} else if (focus === true && this.overlayVisible) {
				this.focusOverlayWindow()
			}
		})
	}

	get overlayVisible() {
		return this._showOverlay
	}

	public getWindow() {
		return this.window
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
			this.window.loadURL(url)
			this.window.webContents.openDevTools({ mode: 'detach', activate: true })
		} else {
			this.window.loadFile(url)
			// this.window.webContents.openDevTools({ mode: 'detach', activate: true })
		}
	}

	public ignoreMouseEvents(ignore: boolean) {
		// Never ignore mouse events if the overlay window is shown.
		if (this._showOverlay) {
			this.window.setIgnoreMouseEvents(false)
			return
		}
		this.window.setIgnoreMouseEvents(ignore, { forward: true })
	}

	public showOverlay() {
		this._showOverlay = true
		this.window.focus()
		this.window.focusOnWebView()
		this.window.moveAbove(this.window.getMediaSourceId())
		this.window.moveTop()
		mainToRendererEvents.toggleOverlayComponent(this.window.webContents, true)
		this.ignoreMouseEvents(false)
		// console.log('showoverlay', {
		// 	visible: this.window.isVisible(),
		// 	focusable: this.window.isFocusable(),
		// 	focused: this.window.isFocused(),
		// 	enabled: this.window.isEnabled(),
		// 	// missioncontrol: this.window.isHiddenInMissionControl(),
		// 	normal: this.window.isNormal(),
		// 	// visibleWorkspaces: this.window.isVisibleOnAllWorkspaces(),
		// })
	}

	public hideOverlay() {
		this._showOverlay = false
		// this.window.focus()
		mainToRendererEvents.toggleOverlayComponent(this.window.webContents, false)
		this.ignoreMouseEvents(true)
		// console.log('hide overlay', {
		// 	hidden: this.window.isVisible(),
		// 	focusable: this.window.isFocusable(),
		// 	focused: this.window.isFocused(),
		// })
	}

	public focusOverlayWindow() {
		OverlayController.activateOverlay()
		this.ignoreMouseEvents(false)
	}

	public focusGameWindow() {
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
			if (!this.window) return
			mainToRendererEvents.showAttachmentPanel(this.window.webContents, 1500)
			// this._showOverlay = true
			// mainToRendererEvents.toggleOverlayComponent(this.window.webContents, this._showOverlay)
		}
	}
}
