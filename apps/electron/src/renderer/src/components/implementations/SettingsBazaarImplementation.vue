<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>Bazaar Settings</h2>
		</header>
		<main class="main">
			<LabelWithCheckboxMolecule v-model="showMyOffers"> Show My Offers: </LabelWithCheckboxMolecule>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'
import { computed } from 'vue'

// STORES
const configStore = useConfigStore()

// GETTERS
const showMyOffers = computed({
	get() {
		return configStore.config.bazaar.showMyOffers
	},
	set(value) {
		configStore.updateAndValidateConfig({ bazaar: { showMyOffers: value } })
	},
})
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	grid-auto-rows: minmax(2rem, max-content);
	column-gap: 2rem;
	row-gap: 0.5rem;
	margin-left: 1rem;
}

.loading {
	display: grid;
	grid-column: span 2;
	justify-items: center;
	margin-top: 12rem;
	gap: 1.5rem;
}
</style>
