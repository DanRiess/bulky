import { Ref, computed, ref } from 'vue'
import { ApiStatus, BulkyRequest, NormalizedApiStatus, ProgressStatus } from './api.types'
import { API_STATUS } from './api.const'
import { AxiosError, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BULKY_UUID } from '@web/utility/uuid'

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

/** conform errors to axios error object */
function conformError(err: string | Error) {
	const message = typeof err === 'string' ? err : err.message
	const name = typeof err === 'string' ? err : err.name

	return {
		message,
		name,
		isAxiosError: false,
		toJSON: () => ({ err }),
	}
}

/** pass this function to each request to update the progress tracker */
export function onProgressEvent(progressEvent: AxiosProgressEvent, progressStatus: Ref<ProgressStatus>) {
	if (progressEvent.total) {
		progressStatus.value.total = progressEvent.total
	}

	progressStatus.value.current = progressEvent.loaded
}

export function useApi<TFn extends (...args: any[]) => Promise<AxiosResponse<any, any>>>(
	apiName: string,
	fn: TFn
): BulkyRequest<TFn> {
	// reactive values to store data and api status
	const data: BulkyRequest<TFn>['data'] = ref(undefined)
	const status = ref<ApiStatus>('IDLE')
	const error = ref<AxiosError | undefined>(undefined)
	const progressStatus = ref<ProgressStatus>({
		current: 0,
		total: 0,
	})

	const uuid = BULKY_UUID.generateTypedUuid<BulkyRequest>()

	/**
	 * initialise the api request
	 */
	const exec = async (...args: Parameters<TFn>) => {
		try {
			// transform the config. this only works if config is the first argument
			const [config, ..._]: [config?: AxiosRequestConfig, ...rest: any[]] = args
			if (config && typeof config === 'object') {
				config.onDownloadProgress = e => onProgressEvent(e, progressStatus)
			}

			//clear current error value
			error.value = undefined

			// start api request
			status.value = 'PENDING'
			const response = await fn(...args)

			// check for response adapter and modify if necessary
			// data.value = typeof responseAdapter === 'function' ? responseAdapter(response.data) : response.data
			data.value = isAxiosResponse(response) ? response.data : response

			status.value = 'SUCCESS'
		} catch (e) {
			console.log(e)

			if (typeof e === 'string') {
				error.value = conformError(e)
			} else if (e instanceof AxiosError) {
				error.value = e
			} else if (e instanceof Error) {
				error.value = conformError(e)
			} else {
				error.value = conformError('Undefined Error')
			}
			status.value = 'ERROR'
		}
	}

	return {
		name: apiName,
		uuid,
		data,
		status,
		error,
		progressStatus,
		exec,
		...createNormalisedApiStatuses(status),
	}
}
