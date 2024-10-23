<template>
	<div class="m-shop-offer-items">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3 @click="expanded = !expanded">Items ({{ items.length }})</h3>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<ul class="item-list">
				<TransitionAtom :group="true" v-on="hooks">
					<component :is="itemComponent" v-for="item in items" :item="item" :price-multiplier="priceMultiplier" />
				</TransitionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>
	</div>
</template>

<script setup lang="ts">
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { UnwrapRef, computed, markRaw, ref } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import { BulkyShopItem, Category } from '@shared/types/bulky.types'
import ShopOfferItemAtom from '../atoms/ShopOfferItemAtom.vue'
import ShopOfferItemAtomMap8Mod from '../atoms/ShopOfferItemAtomMap8Mod.vue'

// PROPS
const props = defineProps<{
	items: BulkyShopItem[] | UnwrapRef<BulkyShopItem>[]
	category: Category
	priceMultiplier: number
}>()

// STATE
const expanded = ref(true)

// GETTERS
const itemComponent = computed(() => {
	return props.category === 'MAP_8_MOD' ? markRaw(ShopOfferItemAtomMap8Mod) : markRaw(ShopOfferItemAtom)
})

const gridTemplateColumns = computed(() => {
	return props.category === 'MAP_8_MOD'
		? 'fit-content(16ch) fit-content(7ch) 1fr auto'
		: 'fit-content(25ch) minmax(4ch, 1fr) fit-content(3.5ch) 24px'
})

// HOOKS
const hooks = useListTransition({
	duration: 0.35,
})
</script>

<style scoped>
.m-shop-offer-items {
	z-index: 1;
}

.item-list {
	display: grid;
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.2rem;
	margin-top: 0.5rem;
	max-height: 8rem;
	overflow-x: hidden;
	overflow-y: auto;
	padding-inline: 0.5rem;
	scrollbar-gutter: stable;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
	text-align: left;
	cursor: pointer;
	user-select: none;
}
</style>
