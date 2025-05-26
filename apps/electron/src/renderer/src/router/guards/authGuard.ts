import { useAuthStore } from '@web/stores/authStore'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authGuard() {
	return (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
		const authStore = useAuthStore()
		if (authStore.isLoggedIn) {
			// User is authenticated, proceed to the route
			next()
		} else {
			// User is not authenticated, redirect to the /auth page
			next({ name: 'Auth', query: { redirect: to.fullPath } })
		}
	}
}
