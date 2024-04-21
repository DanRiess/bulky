import { GameWindow } from '@main/window/gameWindow'
import activeWindow from 'active-win'

/**
 * Determine if the currently focused app lies inside of the game's bounds.
 * Use this in app window and game window blur events to determine if Bulky should be closed or stay open.
 */
export function focusedWindowInsideGameBounds(poeWindow: GameWindow) {
	// detect the currently active window
	const activeWin = activeWindow.sync()

	// If the active window is not bulky, it means the user focused another system app.
	// In this case, check if that system app's bounds overlaps the PoE window
	// If so, force bulky to hide, otherwise it will still be on top of that window.
	if (activeWin && activeWin.title !== import.meta.env.VITE_APP_TITLE) {
		const activeWindowBounds = activeWin.bounds

		// allow a 16px overlap, as some apps seem to calculate their bounding boxes with additional padding
		// Chrome / FF: 8px
		// Notepad: 2px
		return (
			Math.max(activeWindowBounds.x, poeWindow.bounds.x) + 16 <=
			Math.min(activeWindowBounds.x + activeWindowBounds.width, poeWindow.bounds.x + poeWindow.bounds.width)
		)
	}

	return false
}

/**
 * Determine if the currently focused app lies outside of the game's bounds.
 * Use this in app window and game window blur events to determine if Bulky should be closed or stay open.
 */
export function focusedWindowOutsideGameBounds(poeWindow: GameWindow) {
	// detect the currently active window
	const activeWin = activeWindow.sync()

	// If the active window is not bulky, it means the user focused another system app.
	// In this case, check if that system app's bounds overlaps the PoE window
	// If so, force bulky to hide, otherwise it will still be on top of that window.
	if (activeWin && activeWin.title !== import.meta.env.VITE_APP_TITLE) {
		const activeWindowBounds = activeWin.bounds

		// allow a 16px overlap, as some apps seem to calculate their bounding boxes with additional padding
		// Chrome / FF: 8px
		// Notepad: 2px
		return (
			Math.max(activeWindowBounds.x, poeWindow.bounds.x) + 16 >
			Math.min(activeWindowBounds.x + activeWindowBounds.width, poeWindow.bounds.x + poeWindow.bounds.width)
		)
	}

	return false
}
