import { GameWindow } from '@main/window/gameWindow'
import activeWindow from 'active-win'
import { sleepTimer } from './sleepTimer'
import { OverlayWindow } from '@main/window/overlayWindow'

let timeout: NodeJS.Timeout | undefined = undefined

/**
 * Determine if the currently focused app lies inside the game's bounds.
 * Use this in app window and game window blur events to determine if Bulky should be closed or stay open.
 */
export async function focusedWindowInsideGameBounds(poeWindow: GameWindow, overlayWindow: OverlayWindow) {
	// Wait shortly before calculating the active window bounds.
	// Otherwise they can (and will) be completely off (x: -32000 for example).
	await sleepTimer(100)

	// Detect the currently active window
	const activeWin = await activeWindow()

	// If the active window is not bulky, it means the user focused another system app.
	// In this case, check if that system app's bounds overlaps the PoE window
	// If so, force bulky to hide, otherwise it will still be on top of that window.
	if (activeWin && activeWin.title !== import.meta.env.VITE_APP_TITLE) {
		const activeWindowBounds = activeWin.bounds

		// allow a 16px overlap, as some apps seem to calculate their bounding boxes with additional padding
		// Chrome / FF: 8px
		// Notepad: 2px
		const insideBounds =
			Math.max(activeWindowBounds.x, poeWindow.bounds.x) + 16 <=
			Math.min(activeWindowBounds.x + activeWindowBounds.width, poeWindow.bounds.x + poeWindow.bounds.width)

		// console.log({
		// 	poeBounds: { x: poeWindow.bounds.x, width: poeWindow.bounds.width },
		// 	actWin: { x: activeWindowBounds.x, width: activeWindowBounds.width },
		// 	visible: overlayWindow.overlayVisible,
		// 	insideBounds,
		// 	title: activeWin.title,
		// })

		if (!insideBounds && overlayWindow.overlayVisible) {
			timeout = setTimeout(async () => {
				if (await focusedWindowInsideGameBounds(poeWindow, overlayWindow)) {
					overlayWindow.window.hide()
					overlayWindow.hideOverlay()
				}
			}, 250)
		} else {
			clearTimeout(timeout)
		}

		return insideBounds
	} else if (activeWin && activeWin.title === import.meta.env.VITE_APP_TITLE) {
		return false
	}

	return true
}

/**
 * Determine if the currently focused app lies outside of the game's bounds.
 * Use this in app window and game window blur events to determine if Bulky should be closed or stay open.
 */
export async function focusedWindowOutsideGameBounds(poeWindow: GameWindow) {
	// detect the currently active window
	const activeWin = await activeWindow()

	// If the active window is not bulky, it means the user focused another system app.
	// In this case, check if that system app's bounds overlaps the PoE window
	// If so, force bulky to hide, otherwise it will still be on top of that window.
	if (activeWin && activeWin.title !== import.meta.env.VITE_APP_TITLE) {
		const activeWindowBounds = activeWin.bounds

		// console.log(activeWindowBounds)
		// console.log(poeWindow.bounds)

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
