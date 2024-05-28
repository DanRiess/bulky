<template>
	<ul class="m-stash-item-list">
		<StashItemMolecule
			v-for="item in items"
			:item="item[1]"
			:key="item[0]"
			:override-prices="overridePrices"
			@change-override-price="(item, price) => emit('changePriceOverride', item, price)" />
	</ul>
</template>

<script setup lang="ts">
import { BulkyItem, BulkyItemRecord, BulkyPriceOverrideRecord } from '@shared/types/bulky.types'
import StashItemMolecule from './StashItemMolecule.vue'

// PROPS
defineProps<{
	items: BulkyItemRecord
	overridePrices: BulkyPriceOverrideRecord
}>()

// EMITS
const emit = defineEmits<{
	changePriceOverride: [item: BulkyItem, price: number]
}>()
</script>

<style scoped>
.m-stash-item-list {
	display: grid;
	grid-template-columns: 1rem 1.5rem max-content 1.5rem 3rem max-content max-content;
	column-gap: 0.5rem;
	overflow: auto;
}
</style>
