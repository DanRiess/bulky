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
	height: 600px;
	width: 1000px;
	background-color: var(--dr-background-color-app);
	border-radius: 1rem;
	padding: 1rem;
	display: flex;
	align-items: flex-start;
	justify-content: center;
}
</style>
