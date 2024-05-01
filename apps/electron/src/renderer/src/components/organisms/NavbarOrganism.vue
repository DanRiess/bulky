<template>
	<nav class="nav">
		<ButtonAtom :active="appStateStore.selectedView === 'BUY'" @click="appStateStore.selectedView = 'BUY'"> Buy </ButtonAtom>
		<ButtonAtom :active="appStateStore.selectedView === 'SELL'" @click="appStateStore.selectedView = 'SELL'">
			Sell
		</ButtonAtom>
		<div class="icon-buttons">
			<div class="settings-icon" @click="appStateStore.selectedView = 'CONFIG'">
				<SvgIconAtom
					name="settings"
					:use-gradient="true"
					cursor="pointer"
					:active="appStateStore.selectedView === 'CONFIG'"
					width="100%"></SvgIconAtom>
			</div>
			<UserIconMolecule />
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@web/stores/appStateStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import UserIconMolecule from '../molecules/UserIconMolecule.vue'

// STORES
const appStateStore = useAppStateStore()
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

.settings-icon {
	width: 2rem;
}
</style>
