import { Clipboard } from './clipboard'
import { uIOhook, UiohookKey as Key } from 'uiohook-napi'
import { OverlayWindow } from '../window/overlayWindow'
import { sleepTimer } from '../utility/sleepTimer'
import { GameWindow } from '@main/window/gameWindow'

const debounceDuration = 200

export class Chatbox {
	private clipboard: Clipboard
	private debounce: number

	constructor(private overlayWindow: OverlayWindow, private gameWindow: GameWindow) {
		this.clipboard = new Clipboard()
		this.debounce = 0
	}

	/**
	 * Type the provided message into the chatbox.
	 */
	async type(message: string) {
		console.log(message)
		// Prevent multiple fast invocations of this function.
		if (performance.now() < this.debounce) return
		this.debounce = performance.now() + debounceDuration

		// Prevent visual switching to the game window while typing the message.
		// this.overlayWindow.enforceOverlay = true
		const modifierKey = process.platform === 'darwin' ? [Key.Meta] : [Key.Ctrl]

		this.clipboard.write(message)
		this.overlayWindow.getWindow().setFocusable(false)
		this.overlayWindow.focusGameWindow()

		// Without awaiting, the overlay window will still be active while trying to paste the clipboard.
		// 10ms and up worked on my machine. 50ms should still feel instant to the user but is safer.
		// I tried it with 0 to execute the next step at the end of the next cycle, but that was not enough.
		// TODO: find better solution without a magic number.
		await sleepTimer(50)
		console.log(this.gameWindow.hasFocus)

		// The timeouts after enter seem to be absolutely mandatory.
		// Without them, commands after Enter won't be executed anymore.
		// Maybe that's just a Notepad issue? Need to test ingame.

		// Bring forth the chatbox
		uIOhook.keyTap(Key.Enter)
		await sleepTimer(50)
		// Paste message and send
		uIOhook.keyTap(Key.V, modifierKey)
		uIOhook.keyTap(Key.Enter)
		await sleepTimer(50)
		// Restore previous chat
		uIOhook.keyTap(Key.Enter)
		await sleepTimer(50)
		uIOhook.keyTap(Key.ArrowUp)
		uIOhook.keyTap(Key.ArrowUp)

		uIOhook.keyTap(Key.Escape)

		// Restore the clipboard after being done with the pasting.
		this.clipboard.restore()
		this.overlayWindow.getWindow().setFocusable(true)
		this.overlayWindow.focusOverlayWindow()
		// this.overlayWindow.enforceOverlay = false
	}

	/**
	 * Uses CTRL + F to paste a string into an available search bar (stash, vendor).
	 * Since this is currently only done from the notifications panel, some checks from the 'type' function can be skipped.
	 */
	async search(message: string) {
		// Prevent multiple fast invocations of this function.
		if (performance.now() < this.debounce) return
		this.debounce = performance.now() + debounceDuration

		this.overlayWindow.getWindow().setFocusable(false)
		this.overlayWindow.focusGameWindow()

		// Prevent visual switching to the game window while typing the message.
		// this.overlayWindow.enforceOverlay = true
		const modifierKey = process.platform === 'darwin' ? [Key.Meta] : [Key.Ctrl]

		this.clipboard.write(message)
		// this.overlayWindow.assertGameActive()

		// Without awaiting, the overlay window will still be active while trying to paste the clipboard.
		// 10ms and up worked on my machine. 50ms should still feel instant to the user but is safer.
		// I tried it with 0 to execute the next step at the end of the next cycle, but that was not enough.
		// TODO: find better solution without a magic number.
		await sleepTimer(50)

		// Navigate into the search bar.
		uIOhook.keyTap(Key.F, modifierKey)
		// Paste message and send
		uIOhook.keyTap(Key.V, modifierKey)
		uIOhook.keyTap(Key.Enter)
		await sleepTimer(50)
		uIOhook.keyTap(Key.Escape)

		// Restore the clipboard after being done with the pasting.
		this.clipboard.restore()

		this.overlayWindow.getWindow().setFocusable(true)
		this.overlayWindow.focusOverlayWindow()
	}
}
