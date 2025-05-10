<template>
	<div class="m-auth-success">
		<header class="header">
			<h1>Log in successful</h1>
		</header>
		<template v-if="status === 'ERROR'">
			<p>Could not get your profile.</p>
			<ButtonAtom background-color="dark" @click="emit('getProfile')">Try again</ButtonAtom>
		</template>
		<template v-else>
			<LoadingSpinnerAtom />
			<p>Loading your profile...</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import LoadingSpinnerAtom from '../atoms/LoadingSpinnerAtom.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { ApiStatus } from '@web/api/api.types'

// EMITS
const emit = defineEmits<{
	getProfile: []
}>()

// PROPS
defineProps<{
	status: ApiStatus
}>()
</script>

<style scoped>
.m-auth-success {
	display: grid;
	gap: 1.5rem;
	place-items: center;
}
</style>
