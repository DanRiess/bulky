/**
 * This script contains functions to interact with the node API and the user's file system.
 */

import { BulkyConfig } from '@shared/types/config.types'
import { NinjaCategory, NinjaCurrencyDto, NinjaItemDto } from '@shared/types/ninja.types'
import { useConfigStore } from '@web/stores/configStore'
import api from './api.wrapper'

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

	redeemRefreshToken: async (refreshToken: string) => {
		return window.api.redeemRefreshToken(refreshToken)
	},

	readConfig: async () => {
		return window.api.readConfig()
	},

	writeConfig: async (config: BulkyConfig) => {
		return window.api.writeConfig(config)
	},

	getNinjaCategory: async (category: NinjaCategory) => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			let url: string
			if (category === 'Essence') {
				url = 'http://localhost:5174/src/mocks/ninjaEssence.json'
			} else if (category === 'Scarab') {
				url = 'http://localhost:5174/src/mocks/ninjaScarab.json'
			} else if (category === 'Currency') {
				url = 'http://localhost:5174/src/mocks/ninjaCurrency.json'
			} else if (category === 'DeliriumOrb') {
				url = 'http://localhost:5174/src/mocks/ninjaDelirium.json'
			} else if (category === 'Map') {
				url = 'http://localhost:5174/src/mocks/ninjaMaps.json'
			} else if (category === 'UniqueMap') {
				url = 'http://localhost:5174/src/mocks/ninjaUniqueMaps.json'
			} else if (category === 'Beast') {
				url = 'http://localhost:5174/src/mocks/ninjaBeasts.json'
			} else if (category === 'Fossil') {
				url = 'http://localhost:5174/src/mocks/ninjaFossil.json'
			} else if (category === 'Resonator') {
				url = 'http://localhost:5174/src/mocks/ninjaResonator.json'
			} else {
				url = 'http://localhost:5174/src/mocks/ninjaCurrency.json'
			}
			// The type cast is only here because return type of window.api functions
			// is different than an axios response and it messes up other scripts.
			return api.get(url) as unknown as Record<'lines', NinjaCurrencyDto[] | NinjaItemDto[]>
		}

		const configStore = useConfigStore()

		// Compute the url
		const overview = category === 'Currency' || category === 'Fragment' ? 'currency' : 'item'
		const url = `https://poe.ninja/api/data/${overview}overview?league=${configStore.config.league}&type=${category}`

		// Fetch in node main to avoid Cors errors.
		return window.api.getNinjaCategory(url)
	},
}

/**
 * Check if the passed function is a member of poeApi
 */
export function isNodeApiFunction(fn: Function) {
	return Object.keys(nodeApi).find(name => nodeApi[name] === fn)
}
