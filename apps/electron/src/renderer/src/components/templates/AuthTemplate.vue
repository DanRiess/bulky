<template>
	<button @click="getOauthTokens">Start server</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@web/stores/authStore'

// STORES
const authStore = useAuthStore()

// STATE

// METHODS
function getOauthTokens() {
	authStore.getOauthToken()
}
</script>

<style scoped></style>
