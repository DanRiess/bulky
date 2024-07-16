<template>
	<ul class="m-stash-item-list">
		<BaseTransition v-on="headerHooks">
			<li class="header" v-if="items.size > 0">
				<div class="header-option selected">Select</div>
				<div class="header-option name" @click="sortFn('NAME')">Name</div>
				<div class="header-option quantity" @click="sortFn('QUANT')">Qnt</div>
				<div class="header-option price" @click="sortFn('PRICE')">Base$</div>
				<div class="header-option regex">
					Allow Regex
					<InfoPanelMolecule
						:icon-width="16"
						:popup-props="{
							position: 'bottom',
							transitionDirection: 'toBottom',
							popupAlignment: 'right',
							maxWidth: 550,
						}">
						<InfoPanelRegexTemplateAtom />
					</InfoPanelMolecule>
				</div>
			</li>
		</BaseTransition>
		<CssListTransition>
			<StashItemMolecule8ModMap
				v-for="item in items"
				:item="item[1]"
				:key="item[0]"
				:override-prices="overridePrices"
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
import CssListTransition from '@web/transitions/CssListTransition.vue'
import { BaseTransition } from 'vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import StashItemMolecule8ModMap from './StashItemMolecule8ModMap.vue'
import { ShopMap8Mod } from '@web/categories/map/map.types'
import InfoPanelMolecule from './InfoPanelMolecule.vue'
import InfoPanelRegexTemplateAtom from '../atoms/InfoPanelRegexTemplateAtom.vue'

// PROPS
defineProps<{
	items: BulkyShopItemRecord<ShopMap8Mod>
	overridePrices: BulkyItemOverrideRecord
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
	grid-template-columns: 1rem 1.5rem 1fr max-content 8ch max-content;
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
	grid-column: 1 / 7;
	cursor: default;
	align-items: center;
}

.selected {
	grid-column: span 2;
}

.header-option {
	cursor: pointer;
	user-select: none;
}

.header-option.price,
.header-option.quantity {
	text-align: center;
}

.header-option.regex {
	display: flex;
	gap: 0.2rem;
}
</style>
