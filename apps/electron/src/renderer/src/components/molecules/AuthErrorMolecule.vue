<template>
	<div class="m-auth-error">
		<header class="header">
			<h1>
				<slot name="header" />
			</h1>
		</header>
		<p>
			<slot name="error-message" />
		</p>
		<div class="button">
			<ButtonAtom background-color="dark" @click="restartAuthorization">Restart Authorization</ButtonAtom>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@web/stores/authStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'

// EMITS
const emit = defineEmits<{
	restartTokenRequest: []
}>()

// STORES
const authStore = useAuthStore()

// METHODS
function restartAuthorization() {
	authStore.authorizationState = 'IDLE'
	emit('restartTokenRequest')
}
</script>

<style scoped>
.m-auth-error {
	display: grid;
	gap: 1.5rem;
}
</style>
