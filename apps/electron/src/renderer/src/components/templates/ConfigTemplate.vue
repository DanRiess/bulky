<template>
	<main class="t-config">
		<div class="main-container radial-gradient" data-b-override>
			<ConfigCategoriesMolecule />
		</div>
		<div class="main-container radial-gradient" data-b-override>
			<ConfigOrganism />
		</div>
	</main>
</template>

<script setup lang="ts">
import ConfigCategoriesMolecule from '../molecules/ConfigCategoriesMolecule.vue'
import ConfigOrganism from '../organisms/ConfigOrganism.vue'
</script>

<style scoped>
.t-config {
	display: grid;
	grid-template-columns: 25ch minmax(0, 1fr);
	grid-template-rows: 1fr;
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	border-radius: var(--border-radius-medium);
}
</style>
