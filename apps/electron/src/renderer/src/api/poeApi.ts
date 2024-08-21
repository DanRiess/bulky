/**
 * This script contains functions to interact with the official Path of Exile API.
 * Each request requires the user to have a valid OAuth token.
 */

import api from './api.wrapper'
import axios, { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@web/stores/authStore'
import { RequestError } from '@shared/errors/requestError'
import { PoeProfileResponse } from '@shared/types/auth.types'
import { useConfigStore } from '@web/stores/configStore'
import { PoeStashTabCollectionResponse, PoeStashTabResponse } from '@shared/types/dtoResponse.types'
import { PoeStashTab } from '@shared/types/poe.types'

/**
 * Validator: Check if the passed function is a member of poeApi
 */
export function isPoeApiFunction(fn: Function) {
	return Object.keys(poeApi).find(name => poeApi[name] === fn)
}

/**
 * THE API
 */
export const poeApi = {
	getStashTabList: async (config?: AxiosRequestConfig) => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			return api.get<PoeStashTabCollectionResponse>('http://localhost:5174/src/mocks/stash_list.json', config)
		}

		const url = import.meta.env.VITE_POE_SERVER_ENDPOINT + '/stash/' + getSelectedLeague()
		const updatedConfig = await updateConfig(config)

		return api.get<PoeStashTabCollectionResponse>(url, updatedConfig)
	},

	getStashTabItems: async (stashTab: PoeStashTab, config?: AxiosRequestConfig) => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			const mockBase = 'http://localhost:5174/src/mocks'
			if (stashTab.name === 'F') return api.get<PoeStashTabResponse>(mockBase + '/stashFragment.json', config)
			else if (stashTab.name === 'E') return api.get<PoeStashTabResponse>(mockBase + '/stashEssence.json', config)
			else if (stashTab.name === 'Deli') return api.get<PoeStashTabResponse>(mockBase + '/stashDelirium.json', config)
			else if (stashTab.name === 'D') return api.get<PoeStashTabResponse>(mockBase + '/stashDivinationCards.json', config)
			else if (stashTab.name === 'Del') return api.get<PoeStashTabResponse>(mockBase + '/stashDelve.json', config)
			else if (stashTab.name === 'Mta') return api.get<PoeStashTabResponse>(mockBase + '/stashUltimatum.json', config)
			else if (stashTab.name === 'M') return api.get<PoeStashTabResponse>(mockBase + '/stashMaps.json', config)
			else return api.get<PoeStashTabResponse>(mockBase + '/stashDump.json', config)
		}

		const url = import.meta.env.VITE_POE_SERVER_ENDPOINT + `/stash/${getSelectedLeague()}/${stashTab.id}`
		const updatedConfig = await updateConfig(config)

		return api.get<PoeStashTabResponse>(url, updatedConfig)
	},

	getProfile: async (config?: AxiosRequestConfig) => {
		const url = import.meta.env.VITE_POE_SERVER_ENDPOINT + '/profile'
		const updatedConfig = await updateConfig(config)

		return api.get<PoeProfileResponse>(url, updatedConfig)
	},

	/**
	 * The /league endpoint requires a service:* scope, which this app cannot obtain.
	 * Therefore, the contents of that endpoint are hard-copied once per league to
	 * the static folder and retrieved from there.
	 */
	getLeagues: async () => {
		const req = await window.api.getLeagues()
		console.log({ req })
		return req
	},
}

// export const getStashTabListRequest = poeApi.get.bind<
// 	null,
// 	[string],
// 	[AxiosRequestConfig?],
// 	Promise<AxiosResponse<PoeStashTabResponse, any>>
// >(null, 'http://localhost:5173/src/mocks/stash_list.json')

/**
 * Compute and add the bearer token to the supplied config object.
 */
async function updateConfig(config?: AxiosRequestConfig) {
	const token = await getAccessToken()
	console.log(token)

	const defaultConfig: AxiosRequestConfig = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	return { ...defaultConfig, ...config }
}

/**
 * Get the currently selected league. Required for some endpoints.
 */
function getSelectedLeague() {
	const configStore = useConfigStore()
	return configStore.config.league
}

/**
 * Get the access token for the authorization header or throw an error.
 */
async function getAccessToken() {
	const authStore = useAuthStore()
	const token = await authStore.getAccessToken()

	if (!token) {
		authStore.logout()
		throw new RequestError({
			code: 'token_unavailable',
			message: 'Could not get access token.',
			status: 401,
		})
	}

	return token
}
