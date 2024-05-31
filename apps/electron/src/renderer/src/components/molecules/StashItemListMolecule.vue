<template>
	<ul class="m-stash-item-list">
		<BaseTransition v-on="headerHooks">
			<li class="header" v-if="items.size > 0">
				<div class="header-option name" @click="sortFn('NAME')">Name</div>
				<div class="header-option quantity" @click="sortFn('QUANT')">Qnt</div>
				<div class="override"></div>
				<div class="header-option price" @click="sortFn('PRICE')">$</div>
				<div class="header-option stack-price" @click="sortFn('STACKPRICE')">Stack$</div>
			</li>
		</BaseTransition>
		<CssListTransition>
			<StashItemMolecule
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
	BulkyItem,
	BulkyItemRecord,
	BulkyItemSortOptions,
	BulkyItemOverrideRecord,
	BulkyItemOverrideOptions,
} from '@shared/types/bulky.types'
import StashItemMolecule from './StashItemMolecule.vue'
import CssListTransition from '@web/transitions/CssListTransition.vue'
import { BaseTransition } from 'vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'

// PROPS
defineProps<{
	items: BulkyItemRecord
	overridePrices: BulkyItemOverrideRecord
	sortFn: (sortOption: BulkyItemSortOptions['key']) => void
}>()

// EMITS
const emit = defineEmits<{
	changeItemOverride: [item: BulkyItem, price: BulkyItemOverrideOptions]
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
	grid-column: 3 / 8;
	cursor: default;
}

.header-option {
	cursor: pointer;
	user-select: none;
}
</style>
