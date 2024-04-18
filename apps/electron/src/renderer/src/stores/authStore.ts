import { ACCOUNT_SCOPE, LocalOauthTokenStorageStructure, OauthTokenResponse } from '@shared/types/auth.types'
import { useApi } from '@web/api/useApi'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
	const isLoggedIn = ref(false)

	function initialize() {}

	async function getAccessToken() {
		const tokenStructure = getTokenFromLocalStorage()
		if (!tokenStructure) {
			logout()
			return
		}

		// token has expired. attempt renewal.
		if (Date.now() > tokenStructure.exp) {
			window.localStorage.removeItem('tokenStructure')
			await refreshTokenRequest().execute()

			return await getAccessToken()
		}

		return tokenStructure
	}

	function tokenRequest() {
		const request = useApi('test', window.api.generateOauthTokens)

		async function execute() {
			await request.exec()

			if (request.error.value || !request.data.value) {
				return false
			}

			handleSuccessfulTokenResponse(request.data.value)
			return true
		}

		return {
			request,
			execute,
		}
	}

	function refreshTokenRequest() {
		const request = useApi('refreshTokenRequest', window.api.redeemRefreshToken)

		async function execute() {
			// TODO: download refresh token from server here
			const token = '123'
			await request.exec(token)

			if (request.error.value || !request.data.value) {
				return false
			}

			handleSuccessfulTokenResponse(request.data.value)
			return true
		}

		return { request, execute }
	}

	async function handleSuccessfulTokenResponse(response: OauthTokenResponse) {
		// subtract 5 minutes to avoid cases where client thinks a token is valid but it has expired on the server
		const exp = Date.now() + response.expires_in * 1000 - 300000

		// transform the token response to our storage type
		const tokenStructure: LocalOauthTokenStorageStructure = {
			accessToken: response.access_token,
			exp,
			username: response.username,
			scope: response.scope
				.split(' ')
				.map(str => ACCOUNT_SCOPE[str])
				.filter(Boolean),
		}

		window.localStorage.setItem('tokenStructure', JSON.stringify(tokenStructure))

		// TODO: upload refresh token to server here
	}

	function getTokenFromLocalStorage() {
		const tokenString = window.localStorage.getItem('tokenStructure')
		if (!tokenString) return

		try {
			return JSON.parse(tokenString) as LocalOauthTokenStorageStructure
		} catch (e) {
			window.localStorage.removeItem('tokenStructure')
			return undefined
		}
	}

	function logout() {
		isLoggedIn.value = false
		window.localStorage.removeItem('tokenStructure')
		// TODO: remove refresh token from server
		// TODO: clear profile maybe?
	}

	return { isLoggedIn, logout, tokenRequest, getAccessToken, initialize }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
