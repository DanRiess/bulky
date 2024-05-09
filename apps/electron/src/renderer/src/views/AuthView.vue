<template>
	<div class="v-auth">
		<AuthTemplate @restart-token-request="restartTokenRequest" />
	</div>
</template>

<script setup lang="ts">
import AuthTemplate from '@web/components/templates/AuthTemplate.vue'
import { useAuthStore } from '@web/stores/authStore'
import { onMounted } from 'vue'

// STORES
const authStore = useAuthStore()

// STATE
const tokenRequest = authStore.tokenRequest()

// METHODS
async function restartTokenRequest() {
	authStore.authorizationState = 'IDLE'
	await tokenRequest.execute()
}

// HOOKS
onMounted(async () => {
	// start oauth flow on mounted
	if (authStore.authorizationState === 'IDLE') {
		await tokenRequest.execute()
	}
})
</script>

<style scoped>
.v-auth {
	margin: 0 auto;
}
</style>
