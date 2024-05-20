<template>
	<div class="o-auth animated-gradient-background" data-b-override>
		<AuthPendingMolecule
			v-if="authStore.authorizationState === 'PENDING' || authStore.authorizationState === 'IDLE'"
			@copy-sign-in-url="copySignInUrl"
			@open-sign-in-page="openSignInPage" />
		<AuthErrorMolecule
			v-else-if="authStore.authorizationState === 'ERROR'"
			@restart-token-request="emit('restartTokenRequest')">
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
import { useRouter } from 'vue-router'
import { nodeApi } from '@web/api/nodeApi'

// EMITS
const emit = defineEmits<{
	restartTokenRequest: []
}>()

// STORES
const authStore = useAuthStore()

// STATE
const router = useRouter()

// METHODS
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
	() => authStore.authorizationState,
	state => {
		if (state === 'SUCCESS') {
			router.back()
		}
	}
)

// HOOKS
onMounted(() => {
	if (authStore.authorizationState === 'SUCCESS') {
		router.back()
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
