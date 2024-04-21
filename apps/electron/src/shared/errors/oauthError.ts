import { OauthErrorCode, OauthErrorParameters } from '@shared/types/error.types'
import { BulkyError } from './bulkyError'

export class OauthError extends BulkyError {
	name: string
	code: OauthErrorCode
	state: string
	errorUri?: string

	constructor(params: OauthErrorParameters) {
		super(params)

		this.name = 'OauthError'
		this.code = params.code
		this.state = params.state
		this.errorUri = params.errorUri
	}
}
