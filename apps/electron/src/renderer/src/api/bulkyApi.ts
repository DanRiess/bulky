import { AxiosRequestConfig, AxiosResponse } from 'axios'
import api from './api.wrapper'
import { useApi } from './useApi'
import { GetRequestConfig } from './api.types'

export type GenericRequestFunction<TRes extends unknown, TFn extends (config: GetRequestConfig) => any> = (
	config: GetRequestConfig
) => Promise<AxiosResponse<TRes>>

export const bulkyApi = {
	getJson: <TRes extends unknown>(config: GetRequestConfig) => {
		return api.get<TRes>(config.url)
	},
}

const testJsonReq: GenericRequestFunction<{ test: 123 }, typeof bulkyApi.getJson> = bulkyApi.getJson

console.log('testing request')
const req = useApi('somename', testJsonReq)
req.exec({})
