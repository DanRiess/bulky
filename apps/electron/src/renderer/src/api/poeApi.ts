/**
 * This script contains functions to interact with the official Path of Exile API.
 * Each request requires the user to have a valid OAuth token.
 */

import api from './api.wrapper'
import { GenericRequestFunction, GetRequestConfig } from './api.types'
import { StashTabListDto } from '@web/types/dto.types'

const poeApi = {
	get: <TRes extends unknown>(config: GetRequestConfig) => {
		return api.get<TRes>(config.url, config)
	},
}

export const getStashTabListRequest: GenericRequestFunction<StashTabListDto> = poeApi.get
