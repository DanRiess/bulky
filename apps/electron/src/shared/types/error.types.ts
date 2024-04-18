import { ObjectValues } from './utility.types'

export interface BulkyErrorParameters {
	message: string
	status?: number
}

const REQUEST_ERROR_CODE = {
	EADDRINUSE: 'EADDRINUSE',
	duplicate_request: 'duplicate_request',
	port_unavailable: 'port_unavailable',
} as const

export type RequestErrorCode = 'duplicate_request' | 'port_unavailable' | 'EADDRINUSE'
export function isRequestErrorCode(str: string | undefined): str is RequestErrorCode {
	return str !== undefined && !!REQUEST_ERROR_CODE[str]
}

export interface RequestErrorParameters extends BulkyErrorParameters {
	code: RequestErrorCode
	status: number
}

export const OAUTH_ERROR_CODE = {
	invalid_request: 'invalid_request',
	unauthorized_client: 'unauthorized_client',
	access_denied: 'access_denied',
	unsupported_response_type: 'unsupported_response_type',
	server_error: 'server_error',
	temporarily_unavailable: 'temporarily_unavailable',
	state_mismatch: 'state_mismatch',
	code_verifier_undefined: 'code_verifier_undefined',
} as const

export type OauthErrorCode = ObjectValues<typeof OAUTH_ERROR_CODE>

export function isOauthErrorCode(str?: string): str is OauthErrorCode {
	return str !== undefined && !!OAUTH_ERROR_CODE[str]
}

export interface OauthErrorParameters extends BulkyErrorParameters {
	code: OauthErrorCode
	state: string
	errorUri?: string
}

export type SerializedErrorObject = {
	name: string
	message: string
	code?: string
	status?: number
	state?: string
	errorUri?: string
}
