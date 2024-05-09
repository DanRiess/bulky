<template>
	<li class="a-bazaar-offer-item">
		<div class="name">{{ computedItemDisplayValues.name }}</div>
		<div class="secondary-option">{{ computedItemDisplayValues.secondaryOption ?? '' }}</div>
		<div class="stock" v-if="!fullBuyoutWatcher">x{{ computedItemDisplayValues.stock }}</div>
		<div class="quantity">{{ computedItemDisplayValues.quantity }}</div>
		<div>*</div>
		<div class="price">{{ computedItemDisplayValues.price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { ComputedItemDisplayValues } from '@shared/types/bulky.types'

defineProps<{
	fullBuyoutWatcher: boolean
	computedItemDisplayValues: ComputedItemDisplayValues
}>()
</script>

<style scoped>
.a-bazaar-offer-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
	user-select: none;
	transition: all 0.25s ease;
}

.name,
.secondary-option {
	text-wrap: nowrap;
	overflow: hidden;
}

.name {
	font-weight: 500;
	margin-right: 0.5rem;
}

.stock {
	text-align: left;
	padding-left: 0.25rem;
	padding-right: 0.4rem;
}

.quantity {
	text-align: end;
}

.price {
	text-align: start;
}
</style>
