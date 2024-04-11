<template>
	<div class="m-global-filter">
		<LabelWithCheckboxMolecule v-model="filter.fullBuyout" :disabled="filter.alwaysMaxQuantity"
			>Buyout full listing</LabelWithCheckboxMolecule
		>
		<LabelWithCheckboxMolecule v-model="filter.alwaysMaxQuantity" :disabled="filter.fullBuyout"
			>Always Max Quantity</LabelWithCheckboxMolecule
		>
		<LabelWithRangeMolecule v-model="filter.multiplier" :max="2" :step="0.05">Max. Multiplier</LabelWithRangeMolecule>
	</div>
</template>

<script setup lang="ts">
import { AnyFilter } from '@shared/types/bulky.types'
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import LabelWithRangeMolecule from './LabelWithRangeMolecule.vue'

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
