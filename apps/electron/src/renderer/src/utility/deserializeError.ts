import { BulkyError } from '@shared/errors/bulkyError'
import { OauthError } from '@shared/errors/oauthError'
import { RequestError } from '@shared/errors/requestError'
import { SerializedError } from '@shared/errors/serializedError'
import { isOauthErrorCode, isRequestErrorCode } from '@shared/types/error.types'

export function deserializeError(e: unknown) {
	if (e instanceof SerializedError) {
		// Bulky Error
		if (e.error.name === 'BulkyError' && e.error.code) {
			return new BulkyError({
				message: e.error.message,
				status: e.error.status,
			})
		}

		// Request Error
		else if (e.error.name === 'RequestError' && isRequestErrorCode(e.error.code) && e.error.status) {
			return new RequestError({
				message: e.error.message,
				code: e.error.code,
				status: e.error.status,
			})
		}

		// Oauth Error
		else if (e.error.name === 'OauthError' && isOauthErrorCode(e.error.code) && e.error.state) {
			return new OauthError({
				message: e.error.message,
				code: e.error.code,
				state: e.error.state,
				errorUri: e.error.errorUri,
				status: e.error.status,
			})
		}
	}
	return new Error('Unknown Error')
}
