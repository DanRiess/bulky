import { UserErrorCode, UserErrorParameters } from '@shared/types/error.types'
import { BulkyError } from './bulkyError'

export class UserError extends BulkyError {
	name: string
	code: UserErrorCode
	message: string

	constructor(params: UserErrorParameters) {
		super(params)

		this.name = 'UserError'
		this.code = params.code
		this.message = params.message
	}
}
