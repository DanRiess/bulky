<template>
	<div class="o-filter-generic animated-gradient-background flow" data-b-override>
		<header class="title">
			<h1 class="no-select">
				<slot name="title">Filter</slot>
			</h1>
		</header>
		<FilterAttributesGlobalMolecule :filter="store.filter" />
		<FilterAttributesLocalMolecule :store="store" />
	</div>
</template>

<script setup lang="ts">
import { ComputedBulkyFilterStore } from '@shared/types/bulky.types'
import FilterAttributesGlobalMolecule from '../molecules/FilterAttributesGlobalMolecule.vue'
import FilterAttributesLocalMolecule from '../molecules/FilterAttributesLocalMolecule.vue'

// PROPS
defineProps<{
	store: ComputedBulkyFilterStore
}>()

// EMITS
// const emit = defineEmits<{
// 	addFilterField: [uuid: Uuid<BulkyFilter>]
// 	removeFilterField: [uuid: Uuid<BulkyFilter>, idx: number]
// }>()
</script>

<style scoped>
.o-filter-generic {
	--flow-space: 1.5rem;
	transform-origin: right;
	padding: 1rem;
	border-radius: var(--border-radius-medium);
	/* overflow: auto; */
}

.title {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
}

/* don't use subgrid here, it will muck up the filter field animation */
.filters {
	position: relative;
	/* display: grid;
	grid-template-columns: 2fr 1fr auto auto 1.5rem;
	gap: 0.5rem; */
}

.filters > * {
	--flow-space: 0.5em;
}
</style>
