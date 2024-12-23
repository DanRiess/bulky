import { OauthErrorCode } from './error.types'
import { ObjectValues, Uuid } from './utility.types'

// better in another file?
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

/** Query parameters from successful authorization code request */
export type OauthAuthorizationCodeResponse = {
	state: string
	code: string
}

/** The returned response after a successful token exchange request */
export type OauthTokenResponse = {
	access_token: string
	refresh_token: string
	expires_in: number
	scope: string
	username: string
	sub: Uuid
}

/** The transformed token response that will be stored locally */
export type LocalOauthTokenStorageStructure = {
	accessToken: string
	exp: number
	username: string
	scope: AccountScope[]
	sub: Uuid
}

/** The token structure that will be signed */
export type SignableTokenStructure = LocalOauthTokenStorageStructure & {
	refreshToken: string
}

/** Validator for an oauth token object */
export function isLocalOauthTokenStructure(obj: any): obj is LocalOauthTokenStorageStructure {
	return obj && 'accessToken' in obj && 'exp' in obj && 'username' in obj && 'scope' in obj
}

/** Possible error query parameters that can be present in GGG's auth code redirect url */
export type OauthRedirectErrorQueryParameters = {
	error: OauthErrorCode
	state: string
	error_description?: string
	error_uri?: string
}

/** Server response from the /profile endpoint */
export type PoeProfileResponse = {
	uuid: string
	name: string
	locale?: string
	realm?: 'pc' | 'xbox' | 'sony'
	guild?: {
		name: string
	}
	twitch?: {
		name: string
	}
}

/** Profile type that Bulky uses internally for stronger typings */
export type PoeProfile = PoeProfileResponse & {
	uuid: Uuid<PoeProfile>
}

/** Validator for a /profile server response */
export function isPoeProfileResponse(obj: any): obj is PoeProfileResponse {
	return obj && obj.uuid && obj.name
}
