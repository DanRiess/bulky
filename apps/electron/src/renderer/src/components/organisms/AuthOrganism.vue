<template>
	<div class="o-auth animated-gradient-background" data-b-override>
		<AuthIdleMolecule
			v-if="authStore.authorizationState === 'IDLE'"
			@copy-sign-in-url="copySignInUrl"
			@start-oauth-flow="startOauthFlow" />
		<AuthPendingMolecule
			v-else-if="authStore.authorizationState === 'PENDING'"
			@copy-sign-in-url="copySignInUrl"
			@open-sign-in-page="openSignInPage" />
		<AuthSuccessMolecule
			v-else-if="authStore.authorizationState === 'SUCCESS'"
			:status="profileRequest.request.status.value"
			@get-profile="getProfile" />
		<AuthErrorMolecule v-else-if="authStore.authorizationState === 'ERROR'" @restart-token-request="restartTokenRequest">
			<template #header>{{ authStore.serializedError.error.name }}</template>
			<template #error-message>{{ authStore.serializedError.error.message }}</template>
		</AuthErrorMolecule>
	</div>
</template>

<script setup lang="ts">
import { useApi } from '@web/api/useApi'
import AuthPendingMolecule from '../molecules/AuthPendingMolecule.vue'
import { useAuthStore } from '@web/stores/authStore'
import AuthErrorMolecule from '../molecules/AuthErrorMolecule.vue'
import { SerializedError } from '@shared/errors/serializedError'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { nodeApi } from '@web/api/nodeApi'
import AuthIdleMolecule from '../molecules/AuthIdleMolecule.vue'
import AuthSuccessMolecule from '../molecules/AuthSuccessMolecule.vue'

// STORES
const authStore = useAuthStore()

// STATE
const router = useRouter()
const route = useRoute()
const tokenRequest = authStore.tokenRequest()
const profileRequest = authStore.getProfileRequest()

// METHODS
async function startOauthFlow() {
	if (authStore.authorizationState === 'IDLE') {
		const success = await tokenRequest.execute()

		if (success) {
			await profileRequest.execute()
		}
	}
}

async function restartTokenRequest() {
	authStore.authorizationState = 'IDLE'
	const success = await tokenRequest.execute()

	if (success) {
		await profileRequest.execute()
	}
}

async function getProfile() {
	profileRequest.execute()
}

async function openSignInPage() {
	const request = useApi('openAuthCodeUrl', nodeApi.openAuthorizationCodeUrl)
	await request.exec()

	if (request.error.value) {
		authStore.serializedError = new SerializedError(request.error.value)
		authStore.authorizationState = 'ERROR'
	}
}

async function copySignInUrl() {
	const request = useApi('getAuthorizationCodeUrl', nodeApi.getAuthorizationCodeUrl)
	await request.exec()

	if (request.error.value || !request.data.value) {
		authStore.serializedError = new SerializedError(request.error.value)
		authStore.authorizationState = 'ERROR'
		return
	}

	navigator.clipboard.writeText(request.data.value)
}

// WATCHERS
watch(
	() => authStore.isLoggedIn,
	loggedIn => {
		if (loggedIn) {
			const redirectRoute = 'redirect' in route.query ? (route.query.redirect as string) : '/bazaar'
			router.push(redirectRoute)
		}
	}
)

// HOOKS
onMounted(() => {
	if (authStore.isLoggedIn) {
		const redirectRoute = 'redirect' in route.query ? (route.query.redirect as string) : '/bazaar'
		router.push(redirectRoute)
	}
})
</script>

<style scoped>
.o-auth {
	margin: 8rem auto 0 auto;
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
	width: 40ch;
}
</style>
