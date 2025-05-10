import { useAuthStore } from '@web/stores/authStore'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authGuard() {
	return (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
		console.log('called auth guard')
		console.log(to.fullPath)
		const authStore = useAuthStore()
		if (authStore.isLoggedIn) {
			console.log('should call next')
			// User is authenticated, proceed to the route
			next()
		} else {
			console.log('should call auth')
			// User is not authenticated, redirect to the /auth page
			next({ name: 'Auth', query: { redirect: to.fullPath } })
		}
	}
}
