<template>
	<li class="m-stash-item" :style="style">
		<InputCheckboxAtom v-model="selected" @update:model-value="emit('changeItemOverride', item, { selected })" />
		<div class="icon">
			<img :src="item.icon" :alt="item.name" />
		</div>
		<div class="name">{{ item.name }}</div>
		<div class="stack-size">{{ item.quantity }}</div>
		<InputToggleAtom v-model="override" @update:model-value="updateOverrideUsage" />
		<div class="price">
			<template v-if="override">
				<InputNumberAtom
					v-model="overridePrice"
					:step="1"
					:num-digits="1"
					@update:model-value="updateOverrideValue"
					ref="inputEl" />
			</template>
			<template v-else>{{ Math.round(toValue(item.price) * offerMultiplier * 10) / 10 }}</template>
		</div>
		<div class="stack-price">{{ stackPrice }}</div>
	</li>
</template>

<script setup lang="ts">
import { BulkyShopItem, BulkyItemOverrideOptions, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { computed, nextTick, ref, toValue, watch } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import InputToggleAtom from '../atoms/InputToggleAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'

// PROPS
const props = defineProps<{
	item: BulkyShopItem
	overridePrices: BulkyItemOverrideRecord
	offerMultiplier: number
}>()

// EMITS
const emit = defineEmits<{
	changeItemOverride: [item: BulkyShopItem, options: BulkyItemOverrideOptions]
}>()

// STATE
const inputEl = ref<InstanceType<typeof InputNumberAtom>>()
const selected = ref(props.item.selected)
const override = ref(toValue(props.item.priceOverride) > 0)
const overridePrice = ref(props.overridePrices.get(`${props.item.type}_${props.item.tier}`)?.priceOverride ?? props.item.price)

// WATCHERS

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
watch(
	() => props.item.priceOverride,
	price => {
		overridePrice.value = toValue(price)
		override.value = toValue(price) > 0
	}
)

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
watch(
	() => props.item.selected,
	bool => (selected.value = toValue(bool))
)

// GETTERS

/**
 * Compute the price of the entire stack.
 */
const stackPrice = computed(() => {
	const price =
		toValue(props.item.priceOverride) > 0 ? props.item.priceOverride : toValue(props.item.price) * props.offerMultiplier
	return Math.round(toValue(price) * props.item.quantity * 10) / 10
})

/**
 * Defines styles in case this item is unselected.
 */
const style = computed(() => {
	if (!selected.value) {
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
	// focus the number input
	if (bool) {
		nextTick(() => {
			inputEl.value?.focus()
		})
	}

	if (overridePrice.value === props.item.price) return

	if ((bool && overridePrice.value < 0) || (!bool && overridePrice.value > 0)) {
		overridePrice.value *= -1
		emit('changeItemOverride', props.item, { price: overridePrice.value })
	}
}

/**
 * Update the override value if it has changed.
 */
function updateOverrideValue() {
	if (overridePrice.value === toValue(props.item.priceOverride)) return

	emit('changeItemOverride', props.item, { price: overridePrice.value })
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

.name {
	text-wrap: nowrap;
	overflow: auto;
}

.stack-size {
	text-align: center;
}

.stack-price {
	text-align: center;
}

/*
Due to the transition, leaving items get a position: absolute prop.
This takes the element out of the layout flow and therefore nullifies the subgrid.
This is an estimate of the average column layout.
*/
.list-leave-active {
	grid-template-columns: 1rem 1.5rem 1fr 3ch 3ch 3ch 4.15ch;
	gap: 0.5rem;
	width: calc(100% - 1rem);
}
</style>
