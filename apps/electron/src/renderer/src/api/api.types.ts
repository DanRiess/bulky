import { ObjectValues, Uuid } from '@web/types/utitlity.types'
import { API_STATUS } from './api.const'
import { AxiosError } from 'axios'
import { ComputedRef, Ref } from 'vue'

export type ApiStatus = ObjectValues<typeof API_STATUS>
export type NormalizedApiStatus = Record<`status${Capitalize<Lowercase<ApiStatus>>}`, ComputedRef<boolean>>

export type BulkyRequest<TRes = unknown> = {
	name: string
	uuid: Uuid<BulkyRequest>
	status: Ref<ApiStatus>
	data: Ref<TRes | undefined>
	error: Ref<AxiosError | undefined>
	exec: (...args: any) => Promise<void>
	statusIdle: NormalizedApiStatus['statusIdle']
	statusPending: NormalizedApiStatus['statusPending']
	statusSuccess: NormalizedApiStatus['statusSuccess']
	statusError: NormalizedApiStatus['statusError']
}

export type ProgressStatus = {
	current: number
	total: number
}
