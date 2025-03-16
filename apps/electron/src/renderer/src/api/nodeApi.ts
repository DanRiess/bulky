/**
 * This script contains functions to interact with the node API and the user's file system.
 */

import { BulkyConfig } from '@shared/types/config.types'
import { PreprocessedNinjaFile } from '@shared/types/ninja.types'
import api from './api.wrapper'
import { BulkyBazaarOfferDto, Category } from '@shared/types/bulky.types'
import { SignableTokenStructure } from '@shared/types/auth.types'
import { useAuthStore } from '@web/stores/authStore'

export const nodeApi = {
	setIgnoreMouseEvents: async (ignore: boolean) => {
		return window.api.setIgnoreMouseEvents(ignore)
	},

	typeInChat: async (message: string) => {
		return window.api.typeInChat(message)
	},

	pasteSearch: async (message: string) => {
		return window.api.pasteSearch(message)
	},

	openAuthorizationCodeUrl: async () => {
		return window.api.openAuthorizationCodeUrl()
	},

	getAuthorizationCodeUrl: async () => {
		return window.api.getAuthorizationCodeUrl()
	},

	generateOauthTokens: async () => {
		return window.api.generateOauthTokens()
	},

	signTokenResponse: async (tokenResponse: SignableTokenStructure) => {
		return window.api.signTokenResponse(tokenResponse)
	},

	getRefreshToken: async (bulkyJwt: string) => {
		return window.api.getRefreshToken(bulkyJwt)
	},

	redeemRefreshToken: async (refreshToken: string) => {
		return window.api.redeemRefreshToken(refreshToken)
	},

	readConfig: async () => {
		return window.api.readConfig()
	},

	writeConfig: async (config: BulkyConfig) => {
		return window.api.writeConfig(config)
	},

	/**
	 * Download pre-processed ninja data from the proxy.
	 */
	getNinjaData: async (league: string) => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			const url = 'http://localhost:5174/src/mocks/ninjaPreprocessed.json'
			// The type cast is only here because return type of window.api functions
			// is different than an axios response and it messes up other scripts.
			return api.get(url) as unknown as PreprocessedNinjaFile
		}

		// Compute the url. The + sign has to be escaped to %2B.
		const url = `${import.meta.env.VITE_CLOUDFRONT_SERVER}/${league.replace(/\s/g, '%2B')}.json`

		// Fetch in node main to avoid Cors errors.
		return window.api.getNinjaData(url)
	},

	getOffers: async (category: Category, league: string, timestamp: number) => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			let url: string
			if (category === 'BESTIARY') {
				url = 'http://localhost:5174/src/mocks/offersBeasts.json'
			} else if (category === 'CATALYST') {
				url = 'http://localhost:5174/src/mocks/offersCatalyst.json'
			} else if (category === 'CURRENCY') {
				url = 'http://localhost:5174/src/mocks/offersCurrency.json'
			} else if (category === 'DELIRIUM_ORB') {
				url = 'http://localhost:5174/src/mocks/notyetimplemented.json'
			} else if (category === 'DELVE') {
				url = 'http://localhost:5174/src/mocks/offersDelve.json'
			} else if (category === 'ESSENCE') {
				url = 'http://localhost:5174/src/mocks/offersEssence.json'
			} else if (category === 'EXPEDITION') {
				url = 'http://localhost:5174/src/mocks/offersExpedition.json'
			} else if (category === 'FRAGMENT') {
				url = 'http://localhost:5174/src/mocks/offersFragment.json'
			} else if (category === 'HEIST') {
				url = 'http://localhost:5174/src/mocks/offersHeist.json'
			} else if (category === 'MAP') {
				url = 'http://localhost:5174/src/mocks/notyetimplemented.json'
			} else if (category === 'MAP_8_MOD') {
				url = 'http://localhost:5174/src/mocks/offersMap8Mod.json'
			} else {
				url = 'http://localhost:5174/src/mocks/offersScarab.json'
			}
			// The type cast is only here because return type of window.api functions
			// is different than an axios response and it messes up other scripts.
			return api.get(url) as unknown as BulkyBazaarOfferDto[]
		}

		return window.api.getOffers(category, league, timestamp)
	},

	putOffer: async (offerDto: BulkyBazaarOfferDto) => {
		const jwt = await useAuthStore().getBulkyJwt()
		if (!jwt) return

		return window.api.putOffer(offerDto, jwt)
	},

	getActiveWindow: async () => {
		return window.api.getActiveWindow()
	},

	openExternalBrowserWindow: (url: string) => {
		window.api.openExternalBrowserWindow(url)
	},
}

/**
 * Check if the passed function is a member of poeApi
 */
export function isNodeApiFunction(fn: Function) {
	return Object.keys(nodeApi).find(name => nodeApi[name] === fn)
}
