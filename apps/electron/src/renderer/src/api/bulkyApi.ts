import { AxiosRequestConfig, AxiosResponse } from 'axios'
import api from './api.wrapper'
import { useApi } from './useApi'

type GenericRequestFunction<TRes extends unknown, TFn extends (...args: any) => any> = (
	...args: Parameters<TFn>
) => Promise<AxiosResponse<TRes>>

export const bulkyApi = {
	getJson: <TRes extends unknown>(path: string, config: AxiosRequestConfig) => {
		return api.get<TRes>('/')
	},
}

const testJsonReq: GenericRequestFunction<{ test: 123 }, typeof bulkyApi.getJson> = bulkyApi.getJson

const req = useApi('somename', testJsonReq)
req.exec()
req.data.value

testJsonReq()

bulkyApi.getJson
