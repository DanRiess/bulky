<template>
	<li class="m-stash-item" :style="style">
		<div class="metadata">
			<InputCheckboxAtom v-model="selected" @update:model-value="emit('changeItemOverride', item, { selected })" />
			<div class="icon" :class="{ disabled: !selected }">
				<img :src="item.icon" :alt="item.name" />
			</div>
			<div class="name" :class="{ disabled: !selected }">
				{{ item.name }} | {{ BULKY_TRANSFORM.stringToDisplayValue(item.tier) }}
			</div>
			<div class="stack-size" :class="{ disabled: !selected }">{{ item.quantity }}</div>
			<div class="center-content" :class="{ disabled: !selected }">
				<InputNumberAtom
					v-model="overridePrice.base"
					:step="1"
					:num-digits="1"
					@update:model-value="updateOverrideValue"
					ref="inputEl" />
			</div>
			<div class="center-content" :class="{ disabled: !selected }">
				<InputCheckboxAtom
					v-model="allowRegexFilter"
					@update:model-value="emit('changeItemOverride', item, { allowRegexFilter })"
					:disabled="!selected" />
			</div>
		</div>
		<AccordionTransitionWrapperAtom class="grid-column-3-8" :expanded="toValue(item.allowRegexFilter)">
			<ul class="regex-options">
				<!-- MODIFIERS TO AVOID REGEX -->
				<RegexSimpleOptionAtom v-model="overridePrice.avoidRegex" @update-override-value="updateOverrideValue">
					For modifiers to avoid
				</RegexSimpleOptionAtom>

				<!-- WANTED MODIFIERS REGEX -->
				<RegexSimpleOptionAtom v-model="overridePrice.wantedRegex" @update-override-value="updateOverrideValue">
					For wanted modifiers
				</RegexSimpleOptionAtom>

				<!-- QUANTITY REGEXES -->
				<RegexComplexOptionAtom
					v-for="(_, idx) in overridePrice.quantityRegex"
					:key="idx"
					v-model="overridePrice.quantityRegex[idx]"
					:regex-type-array-length="overridePrice.quantityRegex.length"
					@add-price-fragment="addPriceFragment('quantityRegex')"
					@remove-price-fragment="removePriceFragment('quantityRegex', idx)"
					@update-override-value="updateOverrideValue">
					For quantity over
				</RegexComplexOptionAtom>

				<!-- PACKSIZE REGEXES -->
				<RegexComplexOptionAtom
					v-for="(_, idx) in overridePrice.packsizeRegex"
					:key="idx"
					v-model="overridePrice.packsizeRegex[idx]"
					:regex-type-array-length="overridePrice.packsizeRegex.length"
					@add-price-fragment="addPriceFragment('packsizeRegex')"
					@remove-price-fragment="removePriceFragment('packsizeRegex', idx)"
					@update-override-value="updateOverrideValue">
					For pack size over
				</RegexComplexOptionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>
	</li>
</template>

<script setup lang="ts">
import { BulkyShopItem, BulkyItemOverrideOptions, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { computed, ref, toValue, watch } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { ShopMap8Mod } from '@web/categories/map/map.types'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import RegexSimpleOptionAtom from '../atoms/RegexSimpleOptionAtom.vue'
import RegexComplexOptionAtom from '../atoms/RegexComplexOptionAtom.vue'

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
const overridePrice = ref(
	props.overridePrices.get(`${props.item.type}_${props.item.tier}`)?.priceOverrideMap8Mod ??
		toValue(props.item.priceOverrideMap8Mod)
)

// WATCHERS

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
// watch(
// 	() => props.item.priceOverrideMap8Mod,
// 	price => {
// 		overridePrice.value = toValue(price)
// 	}
// )

// On load, the override prices are still being fetched from idb.
// Update the state variables once they change.
watch(
	() => props.item,
	item => {
		selected.value = toValue(item.selected)
		allowRegexFilter.value = toValue(item.allowRegexFilter)
		overridePrice.value = toValue(item.priceOverrideMap8Mod)
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
		}
	}
	return {}
})

// METHODS

/**
 * Update the override value if it has changed.
 */
function updateOverrideValue() {
	emit('changeItemOverride', props.item, { priceMap8Mod: overridePrice.value })
}

function addPriceFragment(type: 'quantityRegex' | 'packsizeRegex') {
	const defaultPercentageValue = type === 'quantityRegex' ? 110 : 35
	overridePrice.value[type].push({
		available: true,
		addedPrice: [defaultPercentageValue, 0],
	})
	updateOverrideValue()
}

function removePriceFragment(type: 'quantityRegex' | 'packsizeRegex', idx: number) {
	overridePrice.value[type].splice(idx, 1)
	updateOverrideValue()
}
</script>

<style scoped>
.m-stash-item,
.metadata {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
}

.metadata {
	height: 2rem;
}

.grid-column-3-8 {
	grid-column: 3/8;
}

.regex-options {
	overflow: hidden;
	display: grid;
	grid-template-columns: 3.5rem max-content 6rem max-content 6ch 1.5rem 1.5rem;
	grid-auto-rows: 2rem;
	gap: 0.5rem;
	margin-top: 0.5rem;
	margin-bottom: 1.5rem;
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
