<template>
	<main class="t-sell-add">
		<div class="main-container flow">
			<CategoryMolecule />
			<StashTabListOrganism />
		</div>
		<div class="main-container"></div>
	</main>
</template>

<script setup lang="ts">
import CategoryMolecule from '../molecules/CategoryMolecule.vue'
import StashTabListOrganism from '../organisms/StashTabListOrganism.vue'
</script>

<style scoped>
.t-sell-add {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
}
</style>
