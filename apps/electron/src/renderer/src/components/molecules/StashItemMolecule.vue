<template>
	<li class="m-stash-item" :style="style">
		<InputCheckboxAtom v-model="list" />
		<div class="icon">
			<img :src="item.icon" :alt="item.name" />
		</div>
		<div class="name">{{ item.name }}</div>
		<div class="stack-size">{{ item.quantity }}</div>
		<InputToggleAtom v-model="override" @update:model-value="updateOverrideUsage" />
		<div class="price">
			<template v-if="override">
				<InputNumberAtom v-model="overridePrice" :step="0.1" @mouseleave="updateOverrideValue" />
			</template>
			<template v-else>{{ item.price }}</template>
		</div>
		<div class="stack-price">{{ stackPrice }}</div>
	</li>
</template>

<script setup lang="ts">
import { BulkyItem, BulkyPriceOverrideRecord } from '@shared/types/bulky.types'
import { computed, ref, toValue } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import InputToggleAtom from '../atoms/InputToggleAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'

// PROPS
const props = defineProps<{
	item: BulkyItem
	overridePrices: BulkyPriceOverrideRecord
}>()

// EMITS
const emit = defineEmits<{
	changeOverridePrice: [item: BulkyItem, price: number]
}>()

// STATE
const list = ref(true)
const override = ref(!!props.item.priceOverride)
const overridePrice = ref(props.overridePrices.get(`${props.item.type}_${props.item.tier}`)?.priceOverride ?? props.item.price)

// GETTERS

/**
 * Compute the price of the entire stack.
 */
const stackPrice = computed(() => {
	return Math.round(toValue(props.item.price) * props.item.quantity * 10) / 10
})

/**
 * Defines styles in case this item is unselected.
 */
const style = computed(() => {
	if (!list.value) {
		return {
			'text-decoration': 'line-through',
			opacity: 0.5,
		}
	}
	return {}
})

// METHODS

/**
 * Toggle between a positive or negative override value.
 * A negative override price means the override won't be used.
 * This way, it can still be saved locally for later use without needing an extra boolean toggle property.
 */
function updateOverrideUsage(bool: boolean) {
	if (overridePrice.value === props.item.price) return
	if ((bool && overridePrice.value < 0) || (!bool && overridePrice.value > 0)) {
		overridePrice.value *= -1
		emit('changeOverridePrice', props.item, overridePrice.value)
	}
}

function updateOverrideValue() {
	if (overridePrice.value === toValue(props.item.priceOverride)) {
		console.log('dont update')
		return
	}

	console.log('update')
}
</script>

<style scoped>
.m-stash-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	height: 2rem;
	align-items: center;
}
</style>
