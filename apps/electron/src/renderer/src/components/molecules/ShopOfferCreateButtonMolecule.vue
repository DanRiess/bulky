<template>
	<div class="m-shop-offer-create-button">
		<template v-if="authStore.isLoggedIn">
			<ButtonAtom @click="router.push({ name: 'CreateOffer' })"> Create New Offer </ButtonAtom>
		</template>
		<template v-else>
			<ButtonAtom @click="router.push({ name: 'Auth' })"> Sign in with your PoE account to create a new offer </ButtonAtom>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@web/stores/authStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'

// STORES
const authStore = useAuthStore()

// STATE
const router = useRouter()
</script>

<style scoped>
.m-shop-offer-create-button {
	width: max-content;
	margin-inline: auto;
}
</style>
