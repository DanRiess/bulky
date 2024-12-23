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
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
	// STATE
	const authorizationState = ref<ApiStatus>('IDLE')
	const serializedError = ref<SerializedError>(new SerializedError())
	const profile = ref<PoeProfile>()

	// GETTERS
	const isLoggedIn = computed(() => {
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') return true

		const token = getTokenFromLocalStorage()
		return profile.value && token && token.username === profile.value.name
	})

	// METHODS

	/**
	 * Check if token and profile can be pulled from local storage.
	 * Attempt to refetch both of these if not.
	 */
	async function initialize() {
		// In test mode, initialize a random user profile.
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			profile.value = {
				name: 'Chavincar#4805',
				uuid: BULKY_UUID.generateTypedUuid<PoeProfile>(),
			}
		}

		// Get the access token.
		const token = await getAccessToken()
		if (!token) return

		// Get the profile if it is not initialized yet.
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

		// Token has expired. Attempt renewal.
		if (Date.now() / 1000 > tokenStructure.exp) {
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
		// Subtract 5 minutes to avoid cases where client thinks a token is valid but it has expired on the server
		const exp = Math.floor(Date.now() / 1000) + response.expires_in - 300

		// Transform the token response to our storage type.
		const tokenStructure: LocalOauthTokenStorageStructure = {
			accessToken: response.access_token,
			exp,
			username: response.username,
			scope: response.scope
				.split(' ')
				.map(str => ACCOUNT_SCOPE[str])
				.filter(Boolean),
			sub: response.sub,
		}

		console.log({ tokenStructure })

		window.localStorage.setItem('tokenStructure', JSON.stringify(tokenStructure))

		// Sign the token structure.
		const signRequest = useApi('sign-token', nodeApi.signTokenResponse)
		await signRequest.exec({
			...tokenStructure,
			refreshToken: response.refresh_token,
		})

		if (signRequest.error.value || !signRequest.data.value) {
			// Show notification.
			// Revoke token?
			logout()
			return
		}

		// Save the jwt.
		window.localStorage.setItem('bulkyJwt', signRequest.data.value)
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
			profile.value = getProfileFromLocalStorage()
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
		if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
			return
		}
		// isLoggedIn.value = false
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
