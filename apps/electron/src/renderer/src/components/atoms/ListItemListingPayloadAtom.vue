<template>
	<li class="a-li-listing">
		<div class="li-listing-name">{{ computedPayloadDisplayItem.name }}</div>
		<div class="li-listing-secondary-option">{{ computedPayloadDisplayItem.secondaryOption }}</div>
		<div class="li-listing-stock" v-if="!fullBuyoutWatcher">x{{ computedPayloadDisplayItem.stock }}</div>
		<div class="li-listing-amount">{{ computedPayloadDisplayItem.amount }}</div>
		<div>*</div>
		<div class="li-listing-price">{{ computedPayloadDisplayItem.price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { FilteredPayloadDisplayItem } from '@web/types/bulky.types'

defineProps<{
	fullBuyoutWatcher: boolean
	computedPayloadDisplayItem: FilteredPayloadDisplayItem
}>()
</script>

<style scoped>
.a-li-listing {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
	user-select: none;
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
}

.li-listing-amount {
	text-align: end;
}

.li-listing-price {
	text-align: start;
}
</style>
