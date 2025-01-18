import { UiohookKey, UiohookKeyboardEvent, uIOhook } from 'uiohook-napi'
import { OverlayWindow } from '../window/overlayWindow'
import { AppStateStore } from '@main/stores/appStateStore'
import activeWindow from 'active-win'

/**
 * Map a key code number to its human-readable name.
 */
const keyCodeToName = Object.fromEntries(Object.entries(UiohookKey).map(([k, v]) => [v, k]))

/**
 * Register global inputs.
 * Called when the electron app is ready.
 */
export function registerInputs(overlayWindow: OverlayWindow) {
	uIOhook.on('keydown', e => handleKeydownEvents(e, overlayWindow))

	uIOhook.start()
}

/**
 * Handle and delegate all keyboard events.
 */
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
		activeWindow().then(window => {
			if (!window) return

			// In dev, the app title (Notepad) also has the documents title appended.
			const isGameTitle = import.meta.env.DEV
				? window.title.includes(import.meta.env.VITE_GAME_TITLE)
				: window.title === import.meta.env.VITE_GAME_TITLE

			// Toggle the active state only if either game or app windows are active.
			// If other keybinds will be handled through this function,
			// consider handling this check at function start instead.
			if (window.title === import.meta.env.VITE_APP_TITLE || isGameTitle) {
				overlayWindow.toggleActiveState()
			}
		})
	}
}
