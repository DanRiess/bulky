import { AttachEvent, OverlayController } from 'electron-overlay-window'
import { EventEmitter } from 'events'
import { dialog } from 'electron'
import { OverlayWindow } from './overlayWindow'

export class GameWindow extends EventEmitter {
	private _isTracking = false

	constructor() {
		super()
	}

	get bounds() {
		return OverlayController.targetBounds
	}

	get hasFocus() {
		return OverlayController.targetHasFocus
	}

	/**
	 * Attach an overlay window to a game window. This function can only be called once.
	 * @param {OverlayWindow} overlayWindow An instance of the OverlayWindow class
	 * @param {string} title Title of the game window.
	 */
	public attach(overlayWindow: OverlayWindow, title: string) {
		console.log('attach to ' + title)
		const window = overlayWindow.window
		if (!window) {
			dialog.showErrorBox('Developer Error', 'No window to attach to.')
			return
		}

		// Register blur and focus event listeners and attach the overlay window to this one.
		if (!this._isTracking) {
			// During development, don't register the listeners if you want to work on styles etc.
			if (import.meta.env.VITE_NO_ATTACH_MODE === 'true') return

			// Despite the name, this listener listens to the game window, not the overlay
			OverlayController.events.on('focus', () => {
				this.emit('game-window-focused', true)
			})

			// Despite the name, this listener listens to the game window, not the overlay
			OverlayController.events.on('blur', async () => {
				this.emit('game-window-focused', false)
			})

			OverlayController.events.on('attach', (e: AttachEvent) => {
				// Listen to this in OverlayWindow class
				this.emit('attach', e)
			})

			// Attach the passed overlay window to the game window
			OverlayController.attachByTitle(window, title, { hasTitleBarOnMac: true })
			this._isTracking = true
		}
	}
}
