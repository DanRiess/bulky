import { BulkyBazaarOfferDto, Category } from '@shared/types/bulky.types'
import activeWindow from 'active-win'
import axios from 'axios'

export async function getOffers(category: Category, league: string, timestamp: number) {
	// Check if Bulky is in the foreground.
	// If not, don't fetch new data.
	const activeWin = await activeWindow()
	if (!activeWin || activeWin.title !== import.meta.env.VITE_APP_TITLE) return

	// Get the offers from the server
	const server = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new Error('Server url not defined.')
	}

	try {
		const res = await axios.get<BulkyBazaarOfferDto[]>(`${server}/offer`, {
			params: {
				category,
				league,
				timestamp,
			},
		})
		return res.data
	} catch (e) {
		return e
	}
}

export async function putOffer(offer: BulkyBazaarOfferDto, jwt: string) {
	// Check if either Bulky or the game window are in the foreground.
	// If not, don't fetch new data.
	const activeWin = await activeWindow()
	if (!activeWin || (activeWin.title !== import.meta.env.VITE_APP_TITLE && activeWin.title !== import.meta.env.VITE_GAME_TITLE))
		return

	const server = import.meta.env.VITE_MAIN_API_SERVER
	if (!server) {
		throw new Error('Server url not defined.')
	}

	try {
		const res = await axios.put(`${server}/offer`, {
			body: offer,
			headers: {
				Authoriztion: `Bearer ${jwt}`,
			},
		})

		return res.data
	} catch (e) {
		return e
	}
}
