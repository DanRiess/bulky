import { UiohookKey, UiohookKeyboardEvent, uIOhook } from 'uiohook-napi'
import { OverlayWindow } from '../window/overlayWindow'
import { AppStateStore } from '@main/stores/appStateStore'

/** map a key code number to its human-readable name */
const keyCodeToName = Object.fromEntries(Object.entries(UiohookKey).map(([k, v]) => [v, k]))

/** register global inputs. called when the electron app is ready */
export function registerInputs(overlayWindow: OverlayWindow) {
	uIOhook.on('keydown', e => handleKeydownEvents(e, overlayWindow))

	uIOhook.start()
}

/** handle and delegate all keyboard events */
function handleKeydownEvents(e: UiohookKeyboardEvent, overlayWindow: OverlayWindow) {
	const appStateStore = AppStateStore.instance

	const appToggleKeys = {
		ctrl: appStateStore.appToggleHotkey.toLowerCase().includes('ctrl'),
		shift: appStateStore.appToggleHotkey.toLowerCase().includes('shift'),
		alt: appStateStore.appToggleHotkey.toLowerCase().includes('alt'),
		key: appStateStore.appToggleHotkey.split('+').pop(),
	}

	// Toggle the overlay
	if (
		e.ctrlKey === appToggleKeys.ctrl &&
		e.shiftKey === appToggleKeys.shift &&
		e.altKey === appToggleKeys.alt &&
		keyCodeToName[e.keycode].toLowerCase() === appToggleKeys.key?.toLowerCase()
	) {
		overlayWindow.toggleActiveState()
	}
}
