<template>
	<div class="settings-icon" @click="router.push('Settings')">
		<SvgIconAtom
			name="settings"
			:use-gradient="true"
			cursor="pointer"
			:active="router.currentRoute.value.name === 'Settings'"
			width="100%"></SvgIconAtom>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// COMPOSABLES
const router = useRouter()
</script>

<style>
.settings-icon {
	width: 2rem;
}
</style>
