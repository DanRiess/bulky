import { RequestErrorCode, RequestErrorParameters } from '@shared/types/error.types'
import { BulkyError } from './bulkyError'

export class RequestError extends BulkyError {
	name: string
	code: RequestErrorCode
	status: number

	constructor(params: RequestErrorParameters) {
		super({ message: params.message })

		this.name = 'RequestError'
		this.code = params.code
		this.status = params.status
	}
}
