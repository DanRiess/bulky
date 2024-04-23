/**
 * This script contains functions to interact with the official Path of Exile API.
 * Each request requires the user to have a valid OAuth token.
 */

import api from './api.wrapper'
import { AxiosRequestConfig } from 'axios'
import { StashTabListDto } from '@shared/types/dto.types'
import { useAuthStore } from '@web/stores/authStore'
import { RequestError } from '@shared/errors/requestError'
import { PoeProfileResponse } from '@shared/types/auth.types'

export const poeApi = {
	getStashTabList: (config?: AxiosRequestConfig) => {
		return api.get<StashTabListDto>('http://localhost:5173/src/mocks/stash_list.json', config)
	},

	getProfile: async (config?: AxiosRequestConfig) => {
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

		const url = import.meta.env.VITE_POE_SERVER_ENDPOINT + '/profile'
		const defaultConfig: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
		config = { ...defaultConfig, ...config }

		return api.get<PoeProfileResponse>(url, config)
	},
}

// export const getStashTabListRequest = poeApi.get.bind<
// 	null,
// 	[string],
// 	[AxiosRequestConfig?],
// 	Promise<AxiosResponse<StashTabListDto, any>>
// >(null, 'http://localhost:5173/src/mocks/stash_list.json')
