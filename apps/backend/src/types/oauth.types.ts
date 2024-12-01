import { ObjectValues, Uuid } from './utitlity.types'

export type OauthStateTransfer = {
	state: string
	code_challenge: string
}

export type OauthCodeVerifierTransfer = {
	state: string
	code_verifier: string
}

export type OauthRedirectQueryParameters = {
	state: string
	code: string
}

export const ACCOUNT_SCOPE = {
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

export type OauthTokenResponse = {
	access_token: string
	refresh_token: string
	expires_in: number
	scope: string
	username: string
	sub: Uuid
}

export type GGGProfileSuccessResponse = {
	locale: string
	name: string
	twitch?: {
		name: string
	}
	uuid: Uuid
}

export type GGGProfileErrorResponse = {
	error: string
	error_description: string
}
