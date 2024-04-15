import { ObjectValues, Uuid } from './utility.types'

// better in another file?
const ACCOUNT_SCOPE = {
	'account:profile': 'account:profile',
	'account:leagues': 'account:leagues',
	'account:stashes': 'account:stashes',
	'account:characters': 'account:characters',
	'account:league_accounts': 'account:league_accounts',
	'account:item_filter': 'account:item_filter',
	'service:leagues': 'service:leagues',
	'service:leagues:ladder': 'service:leagues:ladder',
	'service:pvp_matches': 'service:pvp_matches',
	'service:pvp_matches:ladder': 'service:pvp_matches:ladder',
	'service:psapi': 'service:psapi',
} as const

export type AccountScope = ObjectValues<typeof ACCOUNT_SCOPE>

export type OauthRedirectSuccess = {
	state: string
	code: string
}

export type OauthTokenResponse = {
	accessToken: string
	refreshToken: string
	expires: number
	scope: AccountScope[]
	username: string
	sub: Uuid
}

export type OauthErrorCode =
	| 'invalid_request'
	| 'unauthorized_client'
	| 'access_denied'
	| 'unsupported_response_type'
	| 'server_error'
	| 'temporarily_unavailable'

export type OauthRedirectErrorQueryParameters = {
	error: OauthErrorCode
	state: string
	error_description?: string
	error_uri?: string
}

export class OauthError extends Error {
	error: OauthErrorCode
	state: string
	description?: string
	uri?: string

	constructor(params: OauthRedirectErrorQueryParameters) {
		super()
		this.error = params.error
		this.state = params.state
		this.description = params.error_description
		this.uri = params.error_uri
	}
}

export type OauthCustomErrorCode = 'request_in_progess' | 'port_unavailable' | 'state_mismatch' | 'unknown'

export type OauthCustomErrorParameters = {
	error: OauthCustomErrorCode
	error_description: string
}

export class OauthCustomError extends Error {
	error: OauthCustomErrorCode
	description?: string
	state: undefined

	constructor(params: OauthCustomErrorParameters) {
		super()
		this.error = params.error
		this.description = params.error_description
	}
}

export type OauthErrorResponse = {
	error: OauthErrorCode | OauthCustomErrorCode
	description?: string
	state?: string
}
