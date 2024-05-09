<template>
	<nav class="nav">
		<ButtonAtom :active="router.currentRoute.value.name === 'Bazaar'" @click="router.push('Bazaar')"> Bazaar </ButtonAtom>
		<ButtonAtom :active="router.currentRoute.value.name === 'Shop'" @click="router.push('Shop')"> Shop </ButtonAtom>
		<div class="icon-buttons">
			<SettingsIconMolecule />
			<UserIconMolecule />
		</div>
	</nav>
</template>

<script setup lang="ts">
import ButtonAtom from '../atoms/ButtonAtom.vue'
import SettingsIconMolecule from '../molecules/SettingsIconMolecule.vue'
import UserIconMolecule from '../molecules/UserIconMolecule.vue'
import { useRouter } from 'vue-router'

// COMPOSABLES
const router = useRouter()
</script>

<style scoped>
.nav {
	display: grid;
	gap: 0.5rem;
	grid-template-columns: 7rem 7rem 1fr auto;
	margin-bottom: 1rem;
}

.icon-buttons {
	grid-column: 4/4;
	display: flex;
	gap: 1rem;
}
</style>
