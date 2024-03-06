import { ObjectValues, Uuid } from '@web/types/utitlity.types'
import { API_STATUS } from './api.const'
import { AxiosError, AxiosResponse } from 'axios'
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
	statusIdle: NormalizedApiStatus['statusIdle']
	statusPending: NormalizedApiStatus['statusPending']
	statusSuccess: NormalizedApiStatus['statusSuccess']
	statusError: NormalizedApiStatus['statusError']
}

export type ProgressStatus = {
	current: number
	total: number
}
