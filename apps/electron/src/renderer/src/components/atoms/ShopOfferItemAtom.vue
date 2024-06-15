<template>
	<li class="a-bazaar-offer-item">
		<div class="name">{{ item.name }}</div>
		<div class="quantity">x{{ item.quantity }}</div>
		<div class="price">{{ item.price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { BulkyItem } from '@shared/types/bulky.types'

defineProps<{
	item: BulkyItem
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

.name {
	text-align: left;
	text-wrap: nowrap;
	overflow: hidden;
}

.name {
	margin-right: 0.5rem;
}

.quantity {
	text-align: left;
	padding-left: 0.25rem;
	padding-right: 0.4rem;
}

.price {
	text-align: start;
}
</style>
