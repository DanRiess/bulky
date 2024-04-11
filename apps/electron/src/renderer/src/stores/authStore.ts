import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
	const isLoggedIn = ref(false)

	function logout() {
		isLoggedIn.value = false
	}

	/**
	 * Start the oauth redirection server before initializing the oauth flow.
	 * It will be closed automatically after receiving and processing the incoming message.
	 */
	function startOauthRedirectServer() {
		window.api.startOauthRedirectServer()
	}

	return { isLoggedIn, logout, startOauthRedirectServer }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
