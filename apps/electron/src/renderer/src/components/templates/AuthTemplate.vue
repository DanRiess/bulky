<template>
	<button @click="authStore.generateOauthToken">Start server</button>
	<button @click="authStore.redeemRefreshToken">Redeem Refresh Token</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@web/stores/authStore'

// STORES
const authStore = useAuthStore()
</script>

<style scoped></style>
