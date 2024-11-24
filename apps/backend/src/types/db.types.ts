export type OauthDbItem = {
	state: string
	code_challenge: string
	used: boolean
	code?: string
}
