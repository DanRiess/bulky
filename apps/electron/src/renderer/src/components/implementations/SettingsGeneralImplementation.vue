<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>General Settings</h2>
		</header>
		<main class="main">
			<LabelWithSelectMolecule v-model="configStore.config.league" :options="leagues"> League: </LabelWithSelectMolecule>
			<LabelWithTextMolecule v-model="configStore.config.gameWindowTitle"> PoE Window Title: </LabelWithTextMolecule>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { useLeagueStore } from '@web/stores/leagueStore'
import { computed, onMounted } from 'vue'
import LabelWithTextMolecule from '../molecules/LabelWithTextMolecule.vue'

// STORES
const configStore = useConfigStore()
const leagueStore = useLeagueStore()

// STATE
const leagues = computed(() => {
	return leagueStore.leagues?.map(l => l.id) ?? ['Standard']
})

onMounted(() => {
	leagueStore.initialize()
})
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	column-gap: 2rem;
	row-gap: 0.5rem;
	margin-left: 1rem;
}
</style>
