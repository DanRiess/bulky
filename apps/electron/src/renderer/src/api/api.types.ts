import { ObjectValues, RequireSome, Uuid } from '@shared/types/utility.types'
import { API_STATUS } from './api.const'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ComputedRef, Ref } from 'vue'
import { SerializedError } from '@shared/errors/serializedError'

export type ApiType = 'poe' | 'bulky' | 'node' | 'other'
export type ApiStatus = ObjectValues<typeof API_STATUS>
export type NormalizedApiStatus = Record<`status${Capitalize<Lowercase<ApiStatus>>}`, ComputedRef<boolean>>

/**
 * This type is needed to determine the type of the 'data' field of a BulkyRequest.
 *
 * If the function passed to 'useApi' returns an axios request, we want the 'response.data' field of the response
 * as 'data' field in the BulkyRequest.
 *
 * If the function returns the expected type (fetch requests, electron requests), then we want the 'response' field
 * as 'data' field in the BulkyRequest.
 */
type BulkyReturnType<TFn extends (...args: any) => Promise<unknown>> = Awaited<ReturnType<TFn>> extends AxiosResponse
	? Awaited<ReturnType<TFn>>['data']
	: Awaited<ReturnType<TFn>>

/**
 * This type is necessary because electron requests cannot transfer custom error events. We serialize errors and
 * return them in the response instead of throwing them. The 'useApi' function checks this and takes care of the
 * throwing, but the error type has to be removed from the response.
 */
export type BulkyRequestData<TFn extends (...args: any) => Promise<unknown>> = Exclude<BulkyReturnType<TFn>, SerializedError>

export type BulkyRequest<TFn extends (...args: any) => Promise<unknown> = () => Promise<unknown>> = {
	name: string
	uuid: Uuid<BulkyRequest>
	status: Ref<ApiStatus>
	data: Ref<BulkyRequestData<TFn> | undefined>
	error: Ref<Error | undefined>
	headers: Ref<AxiosResponse['headers'] | undefined>
	exec: (...args: Parameters<TFn>) => Promise<void>
	reset: () => void
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

// export type GetRequestConfig = RequireSome<AxiosRequestConfig, 'url'>

export type PostRequestConfig<D extends Record<keyof D, unknown> = {}> = RequireSome<AxiosRequestConfig<D>, 'url' | 'data'>

// make this a union with postrequestconf, putrequestconf etc
export type BulkyRequestConfig = AxiosRequestConfig | PostRequestConfig

/**
 * Utility base to typecast expected response and request values. To generate typesafe requests, use it like this:
 *
 * @example
 * type PostFn<ExpectedResponse> = GenericRequestFunction<ExpectedResponse, PostRequestConfig<SomeItems>>
 * const testPost: PostFn<number> = api.testFn
 * const req = useApi('someName', testPost)
 */
export type GenericRequestFunction<TRes extends unknown, TConf extends BulkyRequestConfig = AxiosRequestConfig> = (
	path: string,
	config?: TConf
) => Promise<AxiosResponse<TRes>>

// export type GenericRequestFunction<TRes extends unknown, TFn extends (...args: any[]) => any> = (
// 	config: Parameters<TFn>
// ) => Promise<AxiosResponse<TRes>>

// RATE LIMIT TYPES

/** Rate limit object for checking if a request should be fired or not */
type RateLimit = {
	testPeriod: number[]
	current: number[]
	max: number[]
	timeout: number[]
	activeTimeout: number[]
}

/** A list of rate limit objects for all currently rate-limited APIs */
export type RateLimits = {
	poe: RateLimit
	bulky: RateLimit
}

/** An array for collecting timestamps of fired requests to calculate rate limits */
export type RequestTimestamps = {
	poe: number[]
	bulky: number[]
}
