<template>
	<li class="a-bazaar-offer-item">
		<div class="name">{{ item.name }}</div>
		<div class="quantity">x{{ item.quantity }}</div>
		<div class="price">{{ price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { BulkyShopItem } from '@shared/types/bulky.types'
import { UnwrapRef, computed, toValue } from 'vue'

// PROPS
const props = defineProps<{
	item: BulkyShopItem | UnwrapRef<BulkyShopItem>
	priceMultiplier: number
}>()

// GETTERS
const price = computed(() => {
	const p = toValue(props.item.priceOverride) > 0 ? props.item.priceOverride : toValue(props.item.price) * props.priceMultiplier
	return Math.round(toValue(p) * 10000) / 10000
})
</script>

<style scoped>
.a-bazaar-offer-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 4;
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
