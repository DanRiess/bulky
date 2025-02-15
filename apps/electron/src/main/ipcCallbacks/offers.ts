import { AppStateStore } from '@main/stores/appStateStore'
import { OverlayWindow } from '@main/window/overlayWindow'
import { RequestError } from '@shared/errors/requestError'
import { BulkyApiResponse } from '@shared/types/api.types'
import { BulkyBazaarOfferDto, Category } from '@shared/types/bulky.types'
import activeWindow from 'active-win'
import axios from 'axios'

export async function getOffers(category: Category, league: string, timestamp: number, overlayWindow: OverlayWindow) {
	// Check if Bulky is in the foreground.
	// If not, don't fetch new data.
	const appStateStore = AppStateStore.instance
	const activeWin = await activeWindow()

	// This check is for dev only.
	if (activeWin?.title.match('- Notepad')) {
		activeWin.title = 'Notepad'
	}

	// Currently, even if the overlay is visible, the active window could still be the game window, i.e. PoE.
	// We only want to fetch new offers when PoE is focused and Bulky is visible.
	if (
		!activeWin ||
		(activeWin.title !== import.meta.env.VITE_APP_TITLE && activeWin.title !== appStateStore.gameWindowTitle) ||
		!overlayWindow.overlayVisible
	)
		throw new RequestError({ message: `Wrong active window - ${activeWin?.title}`, status: 400, code: 'window_inactive' })

	// Get the offers from the server
	const server = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new RequestError({ message: 'Api url not defined.', status: 400, code: 'invalid_url' })
	}

	const res = await axios.get<BulkyBazaarOfferDto[]>(`${server}/offer`, {
		params: {
			category,
			league,
			timestamp,
		},
	})
	return res.data
}

export async function putOffer(offer: BulkyBazaarOfferDto, jwt: string) {
	const appStateStore = AppStateStore.instance

	// Check if either Bulky or the game window are in the foreground.
	// If not, don't post data.
	const activeWin = await activeWindow()

	// This check is for dev only.
	if (activeWin?.title.match('- Notepad')) {
		activeWin.title = 'Notepad'
	}

	if (!activeWin || (activeWin.title !== import.meta.env.VITE_APP_TITLE && activeWin.title !== appStateStore.gameWindowTitle))
		throw new RequestError({ message: `Wrong active window - ${activeWin?.title}`, status: 400, code: 'window_inactive' })

	const server = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new RequestError({ message: 'Api url not defined.', status: 400, code: 'invalid_url' })
	}

	const res = await axios.put<BulkyApiResponse>(`${server}/offer`, offer, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	})

	return res.data
}
