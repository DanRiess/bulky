<template>
	<li class="a-li-listing">
		<div class="li-listing-name">{{ computedItemDisplayValues.name }}</div>
		<div class="li-listing-secondary-option">{{ computedItemDisplayValues.secondaryOption }}</div>
		<div class="li-listing-stock" v-if="!fullBuyoutWatcher">x{{ computedItemDisplayValues.stock }}</div>
		<div class="li-listing-quantity">{{ computedItemDisplayValues.quantity }}</div>
		<div>*</div>
		<div class="li-listing-price">{{ computedItemDisplayValues.price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { ComputedItemDisplayValues } from '@web/types/bulky.types'

defineProps<{
	fullBuyoutWatcher: boolean
	computedItemDisplayValues: ComputedItemDisplayValues
}>()
</script>

<style scoped>
.a-li-listing {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
	user-select: none;
	transition: all 0.25s ease;
}

.li-listing-name,
.li-listing-secondary-option {
	text-wrap: nowrap;
	overflow: hidden;
}

.li-listing-name {
	font-weight: 500;
	margin-right: 0.5rem;
}

.li-listing-stock {
	text-align: left;
	padding-left: 0.25rem;
	padding-right: 0.4rem;
}

.li-listing-quantity {
	text-align: end;
}

.li-listing-price {
	text-align: start;
}
</style>
