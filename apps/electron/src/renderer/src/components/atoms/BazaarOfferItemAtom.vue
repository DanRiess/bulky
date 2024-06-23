<template>
	<li class="a-bazaar-offer-item">
		<div class="name">{{ item.name }}</div>
		<div class="stock" v-if="!filter.fullBuyout">x{{ item.quantity }}</div>
		<div class="quantity">{{ filter.alwaysMaxQuantity || filter.fullBuyout ? item.quantity : filterField?.quantity }}</div>
		<div>*</div>
		<div class="price">{{ item.price }}</div>
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</li>
</template>

<script setup lang="ts">
import { BulkyBazaarItem, BulkyFilter } from '@shared/types/bulky.types'
import { computed } from 'vue'

// PROPS
const props = defineProps<{
	item: BulkyBazaarItem
	filter: BulkyFilter
}>()

// STATE
const filterField = props.filter.fields.find(field => field.type === props.item.type && field.tier === props.item.tier)

// GETTERS
const gridColumn = computed(() => (props.filter.fullBuyout ? 'span 5' : 'span 6'))
</script>

<style scoped>
.a-bazaar-offer-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: v-bind(gridColumn);
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
	font-weight: 400;
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
