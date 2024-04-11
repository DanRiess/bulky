import { UiohookKey, UiohookKeyboardEvent, uIOhook } from 'uiohook-napi'
import { OverlayWindow } from '../window/overlayWindow'

/** map a key code number to its human-readable name */
const keyCodeToName = Object.fromEntries(Object.entries(UiohookKey).map(([k, v]) => [v, k]))

/** register global inputs. called when the electron app is ready */
export function registerInputs(overlayWindow: OverlayWindow) {
	uIOhook.on('keydown', e => handleKeydownEvents(e, overlayWindow))

	uIOhook.start()
}

/** handle and delegate all keyboard events */
function handleKeydownEvents(e: UiohookKeyboardEvent, overlayWindow: OverlayWindow) {
	// toggle the overlay
	if (e.ctrlKey && keyCodeToName[e.keycode] === 'Space') {
		overlayWindow.toggleActiveState()
		console.log('overlay')
	}
}
