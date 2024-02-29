<template>
	<div class="m-global-filter">
		<LabelWithCheckboxMolecule v-model="filter.fullBuyout">Buyout full listing</LabelWithCheckboxMolecule>
		<LabelWithRangeMolecule v-model="filter.multiplier" :max="2" :step="0.05">Max. Multiplier</LabelWithRangeMolecule>
	</div>
</template>

<script setup lang="ts">
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import LabelWithRangeMolecule from './LabelWithRangeMolecule.vue'
import { AnyFilter } from '@web/types/bulky.types'

defineProps<{
	filter: AnyFilter
}>()
</script>

<style scoped>
.m-global-filter {
	display: grid;
	grid-template-columns: max-content max-content;
	gap: 0.5rem 1rem;
}
</style>
