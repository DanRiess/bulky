import { ACCOUNT_SCOPE, LocalOauthTokenStorageStructure, OauthTokenResponse } from '@shared/types/auth.types'
import { ApiStatus } from '@web/api/api.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
	const isLoggedIn = ref(false)
	const requestStatus = ref<ApiStatus>('IDLE')

	function initialize() {}

	async function getAccessToken() {
		const tokenStructure = getTokenFromLocalStorage()
		if (!tokenStructure) {
			isLoggedIn.value = false
			// TODO: clear profile maybe
			return
		}

		try {
			// token has expired
			if (Date.now() > tokenStructure.exp) {
			}
		} catch (e) {
			// do smth
		}
	}

	async function generateOauthToken() {
		requestStatus.value = 'PENDING'
		const response = await window.api.generateOauthTokens()

		if ('error' in response) {
			requestStatus.value = 'ERROR'
			//throw error here instead i think
			return
		}

		requestStatus.value = 'SUCCESS'
		handleSuccessfulTokenResponse(response)
	}

	async function redeemRefreshToken() {
		requestStatus.value = 'PENDING'
		// TODO: download refresh token from server here
		const token = '123'
		const response = await window.api.redeemRefreshToken(token)

		if ('error' in response) {
			requestStatus.value = 'ERROR'
			return
		}

		requestStatus.value = 'SUCCESS'
		handleSuccessfulTokenResponse(response)
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
	}

	return { isLoggedIn, logout, generateOauthToken, redeemRefreshToken }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
