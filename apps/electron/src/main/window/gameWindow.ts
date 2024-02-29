import { AttachEvent, OverlayController } from 'electron-overlay-window'
import { EventEmitter } from 'events'
import { dialog } from 'electron'
import { OverlayWindow } from './overlayWindow'

export class GameWindow extends EventEmitter {
	private _isActive = false
	private _isTracking = false
	public ignoreNextFocus = false
	public ignoreNextBlur = false

	constructor() {
		super()
	}

	get bounds() {
		return OverlayController.targetBounds
	}

	get isActive() {
		return this._isActive
	}

	set isActive(active: boolean) {
		this._isActive = active
	}

	/**
	 * Attach an overlay window to a game window. This function can only be called once.
	 * @param {OverlayWindow} overlayWindow An instance of the OverlayWindow class
	 * @param {string} title Title of the game window.
	 */
	public attach(overlayWindow: OverlayWindow, title: string) {
		const window = overlayWindow.getWindow()
		if (!window) {
			dialog.showErrorBox('Developer Error', 'No window to attach to.')
			return
		}

		// Register blur and focus event listeners and attach the overlay window to this one.
		if (!this._isTracking) {
			// despite the name, this listener listens to the game window, not the overlay
			OverlayController.events.on('focus', () => {
				if (this.ignoreNextFocus) {
					this.ignoreNextFocus = false
					return
				}
				this.isActive = true
				this.emit('poe-window-active-change', this.isActive)
			})

			// despite the name, this listener listens to the game window, not the overlay
			OverlayController.events.on('blur', () => {
				if (this.ignoreNextBlur) {
					this.ignoreNextBlur = false
					return
				}
				this.isActive = false
				this.emit('poe-window-active-change', this.isActive)
			})

			OverlayController.events.on('attach', (e: AttachEvent) => {
				// listen to this in OverlayWindow class
				this.emit('attach', e)
			})

			// attach the passed overlay window to the game window
			OverlayController.attachByTitle(window, title, { hasTitleBarOnMac: true })
			this._isTracking = true
		}
	}
}
