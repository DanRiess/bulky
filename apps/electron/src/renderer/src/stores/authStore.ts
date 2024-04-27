import { RequestError } from '@shared/errors/requestError'
import { SerializedError } from '@shared/errors/serializedError'
import {
	ACCOUNT_SCOPE,
	LocalOauthTokenStorageStructure,
	OauthTokenResponse,
	PoeProfile,
	isPoeProfileResponse,
} from '@shared/types/auth.types'
import { ApiStatus } from '@web/api/api.types'
import { nodeApi } from '@web/api/nodeApi'
import { poeApi } from '@web/api/poeApi'
import { useApi } from '@web/api/useApi'
import { BULKY_UUID } from '@web/utility/uuid'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
	const isLoggedIn = ref(false)
	const authorizationState = ref<ApiStatus>('IDLE')
	const serializedError = ref<SerializedError>(new SerializedError())
	const profile = ref<PoeProfile>()

	/**
	 * Check if token and profile can be pulled from local storage.
	 * Attempt to refetch both of these if not.
	 */
	async function initialize() {
		const token = await getAccessToken()
		if (!token) return

		isLoggedIn.value = true

		if (!profile.value) {
			profile.value = await getProfile()
		}
	}

	/**
	 * This function returns the currently saved access token from local storage.
	 * If the token is expired, it attempts to use the refresh token.
	 * If neither of this works, the user will be logged out.
	 */
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

		return tokenStructure.accessToken
	}

	/**
	 * This function returns the profile from local storage if it exists.
	 * If not, it attempts to fetch it.
	 */
	async function getProfile() {
		const profile = getProfileFromLocalStorage()

		if (!profile) {
			const profileRequest = getProfileRequest()
			const success = await profileRequest.execute()

			if (!success) return undefined
			else return getProfileFromLocalStorage()
		}

		return profile
	}

	/**
	 * Send a command to the node environment to start the oauth process.
	 */
	function tokenRequest() {
		const request = useApi('tokenRequest', nodeApi.generateOauthTokens)

		async function execute() {
			authorizationState.value = 'PENDING'
			await request.exec()

			if (request.error.value || !request.data.value) {
				// don't set error state when user opens external browser window multiple times
				if (!(request.error.value instanceof RequestError && request.error.value.code === 'duplicate_request')) {
					authorizationState.value = 'ERROR'
					serializedError.value = new SerializedError(request.error.value)
				}
				return false
			}

			handleSuccessfulTokenResponse(request.data.value)
			authorizationState.value = 'SUCCESS'
			return true
		}

		return { request, execute }
	}

	/**
	 * Send a request to the node environment to redeem a refresh token.
	 */
	function refreshTokenRequest() {
		const request = useApi('refreshTokenRequest', nodeApi.redeemRefreshToken)

		async function execute() {
			// TODO: download refresh token from server here
			const token: string | undefined = undefined
			if (!token) return false

			await request.exec(token)

			if (request.error.value || !request.data.value) {
				return false
			}

			handleSuccessfulTokenResponse(request.data.value)
			return true
		}

		return { request, execute }
	}

	/**
	 * Consume a successful token request response.
	 * Save necessary information to localstorage and store the refresh token in the backend.
	 */
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

	/**
	 * Get the PoE profile.
	 */
	function getProfileRequest() {
		const request = useApi('profileRequest', poeApi.getProfile)

		async function execute() {
			await request.exec()

			if (request.error.value || !request.data.value) {
				return false
			}

			window.localStorage.setItem('poeProfile', JSON.stringify(request.data.value))
			return true
		}

		return { request, execute }
	}

	/**
	 * Retrieve the token structure from localstorage if it exists.
	 */
	function getTokenFromLocalStorage() {
		const tokenString = window.localStorage.getItem('tokenStructure')
		if (!tokenString) return undefined

		try {
			return JSON.parse(tokenString) as LocalOauthTokenStorageStructure
		} catch (e) {
			window.localStorage.removeItem('tokenStructure')
			return undefined
		}
	}

	/**
	 * Retrieve the profile from localstorage if it exists.
	 */
	function getProfileFromLocalStorage() {
		const profileString = window.localStorage.getItem('poeProfile')
		if (!profileString) return undefined

		try {
			// assert the type of this response, JSON.parse is not foolproof and can be wrong
			const rawProfile = JSON.parse(profileString)
			if (!isPoeProfileResponse(rawProfile)) throw new TypeError('Unexpected type.')

			const uuid = BULKY_UUID.generateTypedUuid<PoeProfile>(rawProfile.uuid)
			return { ...rawProfile, uuid }
		} catch (e) {
			window.localStorage.removeItem('poeProfile')
			return undefined
		}
	}

	/**
	 * Log out the user and reset state variables.
	 */
	function logout() {
		isLoggedIn.value = false
		profile.value = undefined
		window.localStorage.removeItem('tokenStructure')
		window.localStorage.removeItem('poeProfile')

		// TODO: remove refresh token from server
	}

	return {
		isLoggedIn,
		profile,
		authorizationState,
		serializedError,
		logout,
		tokenRequest,
		getAccessToken,
		initialize,
		getProfileRequest,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
