<template>
	<div class="o-config flow">
		<header class="header">
			<h2>Configuration Options</h2>
		</header>
		<main class="main">
			<LabelWithSelectMolecule v-model="configStore.config.league" :options="leagues" @update:model-value="updateConfig">
				League:
			</LabelWithSelectMolecule>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { useLeagueStore } from '@web/stores/leagueStore'
import { computed, onMounted } from 'vue'

// STORES
const configStore = useConfigStore()
const leagueStore = useLeagueStore()

// STATE
const leagues = computed(() => {
	return leagueStore.leagues?.map(l => l.id) ?? []
})

// replace this later and only call in a beforeunmount hook
function updateConfig() {
	configStore.writeUserConfig()
}

onMounted(() => {
	leagueStore.initialize()
})
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
