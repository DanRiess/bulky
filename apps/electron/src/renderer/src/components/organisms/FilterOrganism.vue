<template>
	<div class="o-filter-generic radial-gradient flow" data-b-override>
		<header class="title">
			<h1 class="no-select">
				<slot name="title">Filter</slot>
			</h1>
		</header>
		<FilterAttributesGlobalMolecule :filter="filter" />
		<FilterAttributesLocalMolecule
			:filter="filter"
			:main-options="mainOptions"
			:secondary-options="secondaryOptions"
			@add-filter-field="e => emit('addFilterField', e)"
			@remove-filter-field="(...args) => emit('removeFilterField', ...args)" />
	</div>
</template>

<script setup lang="ts">
import { AnyFilter, FilterMainOption, FilterSecondaryOption } from '@shared/types/bulky.types'
import FilterAttributesGlobalMolecule from '../molecules/FilterAttributesGlobalMolecule.vue'
import FilterAttributesLocalMolecule from '../molecules/FilterAttributesLocalMolecule.vue'
import { Uuid } from '@shared/types/utility.types'

// PROPS
defineProps<{
	filter: AnyFilter
	mainOptions: FilterMainOption[]
	secondaryOptions: FilterSecondaryOption[]
}>()

// EMITS
const emit = defineEmits<{
	addFilterField: [uuid: Uuid<AnyFilter>]
	removeFilterField: [uuid: Uuid<AnyFilter>, idx: number]
}>()
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
