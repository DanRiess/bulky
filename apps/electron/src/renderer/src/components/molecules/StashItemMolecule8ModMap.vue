<template>
	<li class="m-stash-item" :style="style">
		<InputCheckboxAtom v-model="selected" @update:model-value="emit('changeItemOverride', item, { selected })" />
		<div class="icon">
			<img :src="item.icon" :alt="item.name" />
		</div>
		<div class="name">{{ item.name }}</div>
		<div class="tier" v-if="showTier">{{ BULKY_TRANSFORM.stringToDisplayValue(item.tier) }}</div>
		<div class="stack-size">{{ item.quantity }}</div>
		<div class="center-content">
			<InputNumberAtom
				v-model="overridePrice"
				:step="1"
				:num-digits="1"
				@update:model-value="updateOverrideValue"
				ref="inputEl" />
		</div>
		<div class="center-content">
			<InputCheckboxAtom
				v-model="allowRegexFilter"
				@update:model-value="emit('changeItemOverride', item, { allowRegexFilter })" />
		</div>
	</li>
</template>

<script setup lang="ts">
import { BulkyShopItem, BulkyItemOverrideOptions, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { computed, ref, toValue, watch } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { ShopMap8Mod } from '@web/categories/map/map.types'

// PROPS
const props = defineProps<{
	item: ShopMap8Mod
	overridePrices: BulkyItemOverrideRecord
	showTier?: boolean
}>()

// EMITS
const emit = defineEmits<{
	changeItemOverride: [item: BulkyShopItem, options: BulkyItemOverrideOptions]
}>()

// STATE
const inputEl = ref<InstanceType<typeof InputNumberAtom>>()
const selected = ref(props.item.selected)
const allowRegexFilter = ref(props.item.allowRegexFilter)
const prices = ref(props.item.priceOverrideMap8Mod)
const overridePrice = ref(props.overridePrices.get(`${props.item.type}_${props.item.tier}`)?.priceOverride ?? props.item.price)

// WATCHERS

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
watch(
	() => props.item.priceOverride,
	price => {
		overridePrice.value = toValue(price)
	}
)

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
watch(
	() => props.item,
	item => {
		selected.value = toValue(item.selected)
		allowRegexFilter.value = toValue(item.allowRegexFilter)
		prices.value = toValue(item.priceOverrideMap8Mod)
	},
	{ deep: true }
)

// GETTERS

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

.center-content {
	display: flex;
	justify-content: center;
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
	grid-template-columns: 1rem 1.5rem 1fr 3ch 8ch 2.7rem;
	gap: 0.5rem;
	width: calc(100% - 1rem);
}
</style>
