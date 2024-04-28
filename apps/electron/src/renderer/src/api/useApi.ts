import { Ref, computed, ref } from 'vue'
import { ApiStatus, ApiType, BulkyRequest, BulkyRequestData, NormalizedApiStatus, ProgressStatus } from './api.types'
import { API_STATUS } from './api.const'
import { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BULKY_UUID } from '@web/utility/uuid'
import { SerializedError } from '@shared/errors/serializedError'
import { deserializeError } from '@web/utility/deserializeError'
import { useRateLimitStore } from '@web/stores/ratelimitStore'
import { isPoeApiFunction } from './poeApi'
import { isBulkyApiFunction } from './bulkyApi'
import { isNodeApiFunction } from './nodeApi'

/**
 * Create an object of computed statuses
 */
const createNormalisedApiStatuses = (status: Ref<ApiStatus>) => {
	const normalizedApiStatus: NormalizedApiStatus = {
		statusIdle: computed(() => status.value === API_STATUS.IDLE),
		statusPending: computed(() => status.value === API_STATUS.PENDING),
		statusSuccess: computed(() => status.value === API_STATUS.SUCCESS),
		statusError: computed(() => status.value === API_STATUS.ERROR),
	}

	return normalizedApiStatus
}

/** validator function to distinguish between axios and fetch requests */
function isAxiosResponse(obj: any): obj is AxiosResponse {
	return (
		obj &&
		typeof obj === 'object' &&
		'config' in obj &&
		'data' in obj &&
		'headers' in obj &&
		'status' in obj &&
		'statusText' in obj
	)
}

/** pass this function to each request to update the progress tracker */
export function onProgressEvent(progressEvent: AxiosProgressEvent, progressStatus: Ref<ProgressStatus>) {
	if (progressEvent.total) {
		progressStatus.value.total = progressEvent.total
	}

	progressStatus.value.current = progressEvent.loaded
}

function calculateApiType(fn: Function): ApiType {
	if (isPoeApiFunction(fn)) return 'poe'
	else if (isBulkyApiFunction(fn)) return 'bulky'
	else if (isNodeApiFunction(fn)) return 'node'
	else return 'other'
}

export function useApi<TFn extends (...args: any[]) => Promise<unknown>>(apiName: string, fn: TFn): BulkyRequest<TFn> {
	// reactive values to store data and api status
	const data = ref<BulkyRequestData<TFn>>()
	const status = ref<ApiStatus>('IDLE')
	const error = ref<Error>()
	const headers = ref<AxiosResponse['headers']>()
	const progressStatus = ref<ProgressStatus>({
		current: 0,
		total: 0,
	})

	const uuid = BULKY_UUID.generateTypedUuid<BulkyRequest>()

	/**
	 * initialise the api request
	 */
	async function exec(...args: Parameters<TFn>) {
		try {
			const rateLimitStore = useRateLimitStore()

			// transform the config. this only works if config is the first argument
			const [config, ..._]: [config?: AxiosRequestConfig, ...rest: any[]] = args
			if (config && typeof config === 'object') {
				config.onDownloadProgress = e => onProgressEvent(e, progressStatus)
			}

			//clear current error value
			error.value = undefined

			// start api request
			status.value = 'PENDING'

			// calculate api type to determine if rate limiting is necessary
			const apiType = calculateApiType(fn)
			const shouldBlockRequest = rateLimitStore.blockRequest(apiType)
			if (shouldBlockRequest) {
				throw new RateLimitError()
			}

			const response = await fn(...args)

			// set headers

			// check for response adapter and modify if necessary
			// data.value = typeof responseAdapter === 'function' ? responseAdapter(response.data) : response.data
			const responseData = isAxiosResponse(response) ? response.data : response
			headers.value = isAxiosResponse(response) ? response.headers : undefined

			if (responseData instanceof SerializedError) throw responseData

			data.value = responseData
			status.value = 'SUCCESS'
		} catch (e) {
			error.value = deserializeError(e)
			status.value = 'ERROR'
		}
	}

	/** reset this request */
	function reset() {
		data.value = undefined
		error.value = undefined
		status.value = 'IDLE'
		progressStatus.value.current = 0
		progressStatus.value.total = 0
	}

	return {
		name: apiName,
		uuid,
		data,
		status,
		error,
		headers,
		progressStatus,
		exec,
		reset,
		...createNormalisedApiStatuses(status),
	}
}
