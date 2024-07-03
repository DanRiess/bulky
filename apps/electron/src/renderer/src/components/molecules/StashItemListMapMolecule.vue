<template>
	<ul class="m-stash-item-list">
		<BaseTransition v-on="headerHooks">
			<li class="header" v-if="items.size > 0">
				<div class="header-option selected">Select</div>
				<div class="header-option name" @click="sortFn('NAME')">Name</div>
				<div class="header-option tier" @click="sortFn('TIER')">Tier</div>
				<div class="header-option quantity" @click="sortFn('QUANT')">Qnt</div>
				<div class="override"></div>
				<div class="header-option price" @click="sortFn('PRICE')">$</div>
				<div class="header-option stack-price" @click="sortFn('STACKPRICE')">Stack$</div>
			</li>
		</BaseTransition>
		<CssListTransition>
			<template v-for="tier in itemsByTier">
				<StashItemMolecule
					v-for="item in tier"
					:item="item"
					:show-tier="true"
					:key="item.icon"
					:override-prices="overridePrices"
					:offer-multiplier="offerMultiplier"
					@change-item-override="(item, options) => emit('changeItemOverride', item, options)" />
			</template>
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
import { BaseTransition, computed, ref } from 'vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { MAP_TIER_NAME_TO_IDX } from '@web/categories/map/map.const'

// PROPS
const props = defineProps<{
	items: BulkyShopItemRecord
	overridePrices: BulkyItemOverrideRecord
	offerMultiplier: number
	sortFn: (sortOption: BulkyItemSortOptions['key']) => void
}>()

// STATE
const selectedTiers = ref<Set<number>>(new Set())
selectedTiers.value.add(16)
selectedTiers.value.add(17)

// TODO: rework categorized items into a BulkyShopItemRecord or array instead, makes everything easier
// sorting will be done by the function, not necessary here

// GETTERS
const filteredItems = computed(() => {
	const categorizedItems: Record<string, BulkyShopItem[]> = {}

	props.items.forEach(item => {
		const tier = MAP_TIER_NAME_TO_IDX[item.tier]
		if (typeof tier !== 'number') return
		if (!selectedTiers.value.has(tier)) return

		if (!categorizedItems[tier]) {
			categorizedItems[tier] = []
		}

		categorizedItems[tier].push(item)
	})

	return categorizedItems
})

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
	grid-template-columns: 1rem 1.5rem 1fr 0.5fr repeat(4, max-content);
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
	grid-column: 1 / 9;
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
