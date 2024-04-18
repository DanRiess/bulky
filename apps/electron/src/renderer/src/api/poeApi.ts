/**
 * This script contains functions to interact with the official Path of Exile API.
 * Each request requires the user to have a valid OAuth token.
 */

import api from './api.wrapper'
import { AxiosRequestConfig } from 'axios'
import { StashTabListDto } from '@shared/types/dto.types'

export const poeApi = {
	getStashTabList: (config?: AxiosRequestConfig) => {
		return api.get<StashTabListDto>('http://localhost:5173/src/mocks/stash_list.json', config)
	},
}

// export const getStashTabListRequest = poeApi.get.bind<
// 	null,
// 	[string],
// 	[AxiosRequestConfig?],
// 	Promise<AxiosResponse<StashTabListDto, any>>
// >(null, 'http://localhost:5173/src/mocks/stash_list.json')
