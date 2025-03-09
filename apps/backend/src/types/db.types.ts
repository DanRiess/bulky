import { Uuid } from './utility'

export type OauthDbItem = {
	state: string
	code_challenge: string
	used: boolean
	code?: string
}

export type UserDbItem = {
	userUuid: Uuid
	username: string
	refreshToken?: string
}
