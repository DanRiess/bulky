import { AxiosRequestConfig, AxiosResponse } from 'axios'
import api from './api.wrapper'
import { useApi } from './useApi'

type GenericRequestFunction<TRes extends unknown> = (...args: any) => Promise<AxiosResponse<TRes>>

export const bulkyApi = {
	getJson: <TRes extends unknown>(path: string, config: AxiosRequestConfig) => {
		return api.get<TRes>('/')
	},
}

const testJsonReq: GenericRequestFunction<{ test: 123 }> = bulkyApi.getJson

const req = useApi('somename', testJsonReq)
req.data.value
