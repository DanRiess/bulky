/**
 * This script contains functions to interact with the official Path of Exile API.
 * Each request requires the user to have a valid OAuth token.
 */

import api from './api.wrapper'
import { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@web/stores/authStore'
import { RequestError } from '@shared/errors/requestError'
import { PoeProfileResponse } from '@shared/types/auth.types'
import { useConfigStore } from '@web/stores/configStore'
import { PoeStashListResponse } from '@shared/types/response.types'

export const poeApi = {
	getStashTabList: async (config?: AxiosRequestConfig) => {
		// return api.get<StashTabListDto>('http://localhost:5173/src/mocks/stash_list.json', config)

		const url = import.meta.env.VITE_POE_SERVER_ENDPOINT + '/stash/' + getSelectedLeague()
		const updatedConfig = await updateConfig(config)

		return api.get<PoeStashListResponse>(url, updatedConfig)
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
		return window.api.getLeagues()
	},
}

// export const getStashTabListRequest = poeApi.get.bind<
// 	null,
// 	[string],
// 	[AxiosRequestConfig?],
// 	Promise<AxiosResponse<StashTabListDto, any>>
// >(null, 'http://localhost:5173/src/mocks/stash_list.json')

/**
 * Check if the passed function is a member of poeApi
 */
export function isPoeApiFunction(fn: Function) {
	return Object.keys(poeApi).find(name => poeApi[name] === fn)
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

/**
 * Compute and add the bearer token to the supplied config object.
 */
async function updateConfig(config?: AxiosRequestConfig) {
	const token = await getAccessToken()

	const defaultConfig: AxiosRequestConfig = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	return { ...defaultConfig, ...config }
}
