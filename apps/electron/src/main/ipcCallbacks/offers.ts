import { AppStateStore } from '@main/stores/appStateStore'
import { OverlayWindow } from '@main/window/overlayWindow'
import { RequestError } from '@shared/errors/requestError'
import { BulkyApiResponse } from '@shared/types/api.types'
import { BulkyBazaarOfferDto, BulkyBazaarOfferDtoResponse, BulkyDeleteOfferDto, Category } from '@shared/types/bulky.types'
import activeWindow from 'active-win'
import axios from 'axios'

export async function getOffers(
	data: { category: Category; league: string; timestamp: number; jwt: string },
	overlayWindow: OverlayWindow
) {
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
			category: data.category,
			league: data.league,
			timestamp: data.timestamp,
		},
		headers: {
			Authorization: `Bearer ${data.jwt}`,
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

	const res = await axios.put<BulkyBazaarOfferDtoResponse>(`${server}/offer`, offer, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	})

	return res.data
}

export async function deleteOffer(offer: BulkyDeleteOfferDto, jwt: string) {
	console.log({ deleteoffer: offer })
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

	// Prepare the timestamps
	// Filter out any that are older than the offer ttl, as they won't be fetched anyway.
	const offerTtl = parseInt(import.meta.env.VITE_OFFER_TTL ?? '630000')
	const timestamps = offer.timestamps.filter(ts => Date.now() - ts < offerTtl)

	// If there are no timestamps left, consider the 'deletion' successful.
	// The offer won't be fetched anymore.
	if (timestamps.length === 0) {
		const mockedSuccessResponse: BulkyApiResponse = {
			statusCode: 200,
			body: 'Nothing to remove',
		}
		return mockedSuccessResponse
	}

	const searchParams = new URLSearchParams()
	searchParams.append('uuid', offer.uuid)
	searchParams.append('category', offer.category)
	searchParams.append('league', offer.league)
	searchParams.append('timestamps', timestamps.join(','))

	const res = await axios.delete<BulkyApiResponse>(`${server}/offer?${searchParams.toString()}`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	})

	return res.data
}
