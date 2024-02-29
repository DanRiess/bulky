import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const authStore = defineStore('authStore', () => {
	const router = useRouter()
	const isLoggedIn = ref(true)

	function logout() {
		isLoggedIn.value = false
		router.push({ name: 'AuthView' })
	}

	return { isLoggedIn, logout }
})
