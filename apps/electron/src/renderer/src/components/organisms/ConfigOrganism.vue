<template>
	<div class="o-config flow">
		<header class="header">
			<h2>Configuration Options</h2>
		</header>
		<main class="main">
			<LabelWithSelectMolecule v-model="configStore.config.league" :options="leagues" @update:model-value="updateConfig"
				>League:</LabelWithSelectMolecule
			>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { getKeys } from '@web/types/utitlity.types'
import { LEAGUE } from '@web/types/poe.types'

// STORES
const configStore = useConfigStore()

const leagues = getKeys(LEAGUE).filter(l => l !== 'UNSUPPORTED')

// replace this later and only call in a beforeunmount hook
function updateConfig() {
	configStore.writeUserConfig()
}
</script>

<style scoped>
.o-config {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	gap: 2rem;
	margin-left: 1rem;
}
</style>
