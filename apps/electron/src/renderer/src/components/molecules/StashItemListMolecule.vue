<template>
	<ul class="m-stash-item-list">
		<TransitionAtom v-on="headerHooks">
			<li class="header" v-if="items.size > 0">
				<div class="header-option selected">Select</div>
				<div class="header-option name" @click="sortFn('NAME')">Name</div>
				<div class="header-option quantity" @click="sortFn('QUANT')">Qnt</div>
				<div class="override"></div>
				<div class="header-option price" @click="sortFn('PRICE')">$</div>
				<div class="header-option stack-price" @click="sortFn('STACKPRICE')">Stack$</div>
			</li>
		</TransitionAtom>
		<CssListTransition>
			<StashItemMolecule
				v-for="item in items"
				:item="item[1]"
				:key="item[0]"
				:override-prices="overridePrices"
				:offer-multiplier="offerMultiplier"
				@change-item-override="(item, options) => emit('changeItemOverride', item, options)" />
		</CssListTransition>
	</ul>
</template>

<script setup lang="ts">
import {
	BulkyShopItem,
	BulkyShopItemRecord,
	BulkyItemSortOptions,
	BulkyItemOverrideRecord,
	BulkyItemOverrideOptions,
} from '@shared/types/bulky.types'
import StashItemMolecule from './StashItemMolecule.vue'
import CssListTransition from '@web/transitions/CssListTransition.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'

// PROPS
defineProps<{
	items: BulkyShopItemRecord
	overridePrices: BulkyItemOverrideRecord
	offerMultiplier: number | undefined
	sortFn: (sortOption: BulkyItemSortOptions['key']) => void
}>()

// EMITS
const emit = defineEmits<{
	changeItemOverride: [item: BulkyShopItem, price: BulkyItemOverrideOptions]
}>()

// COMPOSABLES
const headerHooks = useGenericTransitionHooks({
	opacity: 0,
	scaleX: 0.01,
})
</script>

<style scoped>
.m-stash-item-list {
	display: grid;
	grid-template-columns: 1rem 1.5rem 1fr repeat(4, max-content);
	grid-auto-rows: 2rem;
	column-gap: 0.5rem;
	row-gap: 0.1rem;
	overflow: auto;
	overflow-x: hidden;
	padding-right: 0.5rem;
	position: relative;
	scrollbar-gutter: stable;
}

.header {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: 1 / 8;
	cursor: default;
}

.selected {
	grid-column: span 2;
}

.header-option {
	cursor: pointer;
	user-select: none;
}
</style>
