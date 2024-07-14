<template>
	<div class="m-global-filters">
		<div class="default-filters">
			<LabelWithCheckboxMolecule v-if="filter.fullBuyout" v-model="filter.fullBuyout" :disabled="filter.alwaysMaxQuantity">
				Buyout full listing
			</LabelWithCheckboxMolecule>
			<LabelWithCheckboxMolecule v-model="filter.alwaysMaxQuantity" :disabled="filter.fullBuyout">
				Always Max Quantity
			</LabelWithCheckboxMolecule>
			<LabelWithRangeMolecule v-if="filter.multiplier" v-model="filter.multiplier" :max="2" :step="0.05">
				Max. Multiplier
			</LabelWithRangeMolecule>
		</div>
		<div class="regex-filter">
			<LabelWithTextMolecule v-if="filter.regex !== undefined" v-model="filter.regex" max-length="50"
				>Regex</LabelWithTextMolecule
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { BulkyFilter } from '@shared/types/bulky.types'
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import LabelWithRangeMolecule from './LabelWithRangeMolecule.vue'
import LabelWithTextMolecule from './LabelWithTextMolecule.vue'

defineProps<{
	filter: BulkyFilter
}>()
</script>

<style scoped>
.default-filters {
	display: grid;
	grid-template-columns: max-content max-content;
	gap: 0.5rem 1rem;
	margin-bottom: 1rem;
}

.regex-filter {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 0.5rem 1rem;
}
</style>
