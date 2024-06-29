<template>
	<SingleColumnLayout>
		<AuthOrganism @restart-token-request="restartTokenRequest" />
	</SingleColumnLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SingleColumnLayout from '@web/components/layouts/SingleColumnLayout.vue'
import AuthOrganism from '@web/components/organisms/AuthOrganism.vue'
import { useAuthStore } from '@web/stores/authStore'

// STORES
const authStore = useAuthStore()

// STATE
const tokenRequest = authStore.tokenRequest()
const profileRequest = authStore.getProfileRequest()

// METHODS
async function restartTokenRequest() {
	authStore.authorizationState = 'IDLE'
	const success = await tokenRequest.execute()

	if (success) {
		await profileRequest.execute()
	}
}

// HOOKS
onMounted(async () => {
	// start oauth flow on mounted
	if (authStore.authorizationState === 'IDLE') {
		const success = await tokenRequest.execute()

		if (success) {
			await profileRequest.execute()
		}
	}
})
</script>

<style scoped></style>
