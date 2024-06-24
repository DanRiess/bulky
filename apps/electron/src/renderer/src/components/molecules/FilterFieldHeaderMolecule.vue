<template>
	<div class="a-filter-field-header no-select">
		<div class="field-type">{{ mainOptionName }}</div>
		<div class="field-tier" v-show="secondaryOptionName && store.filterFieldTierOptions.length > 1">
			{{ secondaryOptionName }}
		</div>
		<div class="field-quantity" v-show="!store.filter.alwaysMaxQuantity">Quantity</div>
	</div>
</template>

<script setup lang="ts">
import { ComputedBulkyFilterStore } from '@shared/types/bulky.types'
import { computed } from 'vue'

const props = defineProps<{
	mainOptionName: string
	secondaryOptionName?: string
	store: ComputedBulkyFilterStore
}>()

const gridTemplateColumns = computed(() => {
	const secondary = props.secondaryOptionName && props.store.filterFieldTierOptions.length > 1 ? '1fr' : '0'
	const quant = props.store.filter.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${secondary} ${quant} 1.5rem`
})
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.a-filter-field-header {
	/* display: grid;
	grid-template-columns: subgrid;
	grid-column: span 4; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.5rem;
	transition: grid-template-columns 0.25s ease;
}

.field-type {
	grid-column: 1/2;
}

.field-tier {
	grid-column: 2/3;
}

.field-quantity {
	place-self: center;
	grid-column: 3/4;
}
</style>
