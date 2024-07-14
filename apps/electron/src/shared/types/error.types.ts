import { ObjectValues } from './utility.types'

export interface BulkyErrorParameters {
	message: string
	status?: number
}

const REQUEST_ERROR_CODE = {
	EADDRINUSE: 'EADDRINUSE',
	duplicate_request: 'duplicate_request',
	port_unavailable: 'port_unavailable',
	token_unavailable: 'token_unavailable',
	computed_rate_limit: 'computed_rate_limit',
	rate_limit: 'rate_limit',
} as const

export type RequestErrorCode = ObjectValues<typeof REQUEST_ERROR_CODE>
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
	redirect_server_unavailable: 'redirect_server_unavailable',
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

export const RENDERER_ERROR_CODE = {
	regex_unsupported: 'regex_unsupported',
	unknown_item: 'unknown_item',
	unknown_error: 'unknown_error',
} as const

export type RendererErrorCode = ObjectValues<typeof RENDERER_ERROR_CODE>

export interface RendererErrorParameters extends BulkyErrorParameters {
	code: RendererErrorCode
}

export type SerializedErrorObject = {
	name: string
	message: string
	code?: string
	status?: number
	state?: string
	errorUri?: string
}
