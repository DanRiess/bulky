import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('authStore', () => {
	const router = useRouter()
	const isLoggedIn = ref(true)

	function logout() {
		isLoggedIn.value = false
		router.push({ name: 'AuthView' })
	}

	return { isLoggedIn, logout }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
