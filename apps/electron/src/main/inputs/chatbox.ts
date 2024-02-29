import { Clipboard } from './clipboard'
import { uIOhook, UiohookKey as Key } from 'uiohook-napi'
import { OverlayWindow } from '../window/overlayWindow'
import { sleepTimer } from '../utility/sleepTimer'

const debounceDuration = 200

export class Chatbox {
	private clipboard: Clipboard
	private debounce: number

	constructor(private overlayWindow: OverlayWindow) {
		this.clipboard = new Clipboard()
		this.debounce = 0
	}

	/**
	 * Type the provided message into the chatbox.
	 */
	async type(message: string) {
		// prevent multiple fast invocations of this function
		if (performance.now() < this.debounce) return
		this.debounce = performance.now() + debounceDuration

		// prevent visual switching to the game window while typing the message
		this.overlayWindow.enforceOverlay = true
		const modifierKey = process.platform === 'darwin' ? [Key.Meta] : [Key.Ctrl]

		this.clipboard.write(message)
		this.overlayWindow.assertGameActive()

		// without awaiting, the overlay window will still be active while trying to paste the clipboard.
		// this magic number seems to work ok. tried it with 0 to execute the next step at the end of
		// the next cycle, but that was not enough.
		await sleepTimer(16)

		// bring forth the chatbox
		uIOhook.keyTap(Key.Enter)
		// paste message and send
		uIOhook.keyTap(Key.V, modifierKey)
		uIOhook.keyTap(Key.Enter)
		// restore previous chat
		uIOhook.keyTap(Key.Enter)
		uIOhook.keyTap(Key.ArrowUp)
		uIOhook.keyTap(Key.ArrowUp)
		uIOhook.keyTap(Key.Escape)

		await sleepTimer(16)

		// restore the clipboard after being done with the pasting
		this.clipboard.restore()
		this.overlayWindow.assertOverlayActive()
		this.overlayWindow.enforceOverlay = false
	}
}
