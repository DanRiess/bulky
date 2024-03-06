import { ObjectValues, RequireSome, Uuid } from '@web/types/utitlity.types'
import { API_STATUS } from './api.const'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ComputedRef, Ref } from 'vue'

export type ApiStatus = ObjectValues<typeof API_STATUS>
export type NormalizedApiStatus = Record<`status${Capitalize<Lowercase<ApiStatus>>}`, ComputedRef<boolean>>

export type BulkyRequest<TFn extends (...args: any) => Promise<AxiosResponse<unknown, any>> = () => Promise<AxiosResponse>> = {
	name: string
	uuid: Uuid<BulkyRequest>
	status: Ref<ApiStatus>
	data: Ref<Awaited<ReturnType<TFn>>['data'] | undefined>
	error: Ref<AxiosError | undefined>
	exec: (...args: Parameters<TFn>) => Promise<void>
	progressStatus: Ref<ProgressStatus>
	statusIdle: NormalizedApiStatus['statusIdle']
	statusPending: NormalizedApiStatus['statusPending']
	statusSuccess: NormalizedApiStatus['statusSuccess']
	statusError: NormalizedApiStatus['statusError']
}

export type ProgressStatus = {
	current: number
	total: number
}

export type GetRequestConfig = RequireSome<AxiosRequestConfig, 'url'>

export type PostRequestConfig<D extends Record<keyof D, unknown> = {}> = RequireSome<AxiosRequestConfig<D>, 'url' | 'data'>

// make this a union with postrequestconf, putrequestconf etc
export type BulkyRequestConfig = GetRequestConfig | PostRequestConfig

/**
 * Utility base to typecast expected response and request values. To generate typesafe requests, use it like this:
 *
 * @example
 * type PostFn<ExpectedResponse> = GenericRequestFunction<ExpectedResponse, PostRequestConfig<SomePayload>>
 * const testPost: PostFn<number> = api.testFn
 * const req = useApi('someName', testPost)
 */
export type GenericRequestFunction<TRes extends unknown, BulkyRequestConfig = GetRequestConfig> = (
	config: BulkyRequestConfig
) => Promise<AxiosResponse<TRes>>

// export type GenericRequestFunction<TRes extends unknown, TFn extends (...args: any[]) => any> = (
// 	config: Parameters<TFn>
// ) => Promise<AxiosResponse<TRes>>
