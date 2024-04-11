<template>
	<button @click="authStore.startOauthRedirectServer">Start server</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@web/stores/authStore'

// STORES
const authStore = useAuthStore()
</script>

<style scoped></style>
