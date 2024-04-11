/**
 * This script contains an example api.
 * Each post/put/patch request needs to define its payload and also should define a narrowed GenericRequestFunction type.
 * Check the comment at GenericRequestFunction or the example below to see how it's done
 */

import api from './api.wrapper'
import { GenericRequestFunction, PostRequestConfig } from './api.types'
import { GenericListingDto } from '@shared/types/dto.types'
import { AxiosRequestConfig } from 'axios'

type PostPayload = {
	we: string
	need: string
	this: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL_BULKY

export const bulkyApi = {
	getJson: <TRes extends unknown>(url: string, config: AxiosRequestConfig) => {
		return api.get<TRes>(url, config)
	},

	postStuff: <TRes extends unknown>(url: string, config: PostRequestConfig<PostPayload>) => {
		return api.post<TRes, PostPayload>(url, config.data, config)
	},

	get: <TRes extends unknown>(path: string, config?: AxiosRequestConfig) => {
		return api.get<TRes>(`${BASE_URL}/${path}`, config)
	},
}

export const getListing: GenericRequestFunction<GenericListingDto[]> = bulkyApi.get

// EXAMPLE

// /** create a narrowed GenericRequestFunction type to make the code calling this more concise */
// type PostRequestFunction<TRes extends unknown> = GenericRequestFunction<TRes, PostRequestConfig<PostPayload>>

// /** create the api function with the expected return type */
// const testPost: PostRequestFunction<string> = bulkyApi.postStuff

// /** this is now typesafe. req.exec will require the PostPayload and req.data.value will be a string */
// const req = useApi('test', testPost)
// console.log(req)
