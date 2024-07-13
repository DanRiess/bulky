import { RendererErrorCode, RendererErrorParameters } from '@shared/types/error.types'
import { BulkyError } from './bulkyError'

export class RendererError extends BulkyError {
	name: string
	code: RendererErrorCode
	message: string
	status?: number | undefined

	constructor(params: RendererErrorParameters) {
		super(params)

		this.name = 'OauthError'
		this.code = params.code
		this.message = params.message
		this.status = params.status
	}
}
