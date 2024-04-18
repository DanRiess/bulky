import { BulkyErrorParameters } from '@shared/types/error.types'

export class BulkyError extends Error {
	name: string
	code: string
	message: string
	status?: number

	constructor(params: BulkyErrorParameters) {
		super()
		this.name = 'BulkyError'
		this.code = 'unspecified_error'
		this.message = params.message
		this.status = params.status ?? 400
	}
}
