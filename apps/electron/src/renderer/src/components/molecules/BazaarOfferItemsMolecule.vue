<template>
	<div class="m-bazaar-offer-items">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3 class="no-select">Items</h3>
			<div class="price">
				<PriceAtom label="Price:" :price="price" />
			</div>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<ul class="item-list">
				<TransitionAtom :group="true" v-on="hooks">
					<BazaarOfferItemAtom v-for="item in items" :filter="filter" :item="item" />
				</TransitionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>
	</div>
</template>

<script setup lang="ts">
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { computed, onMounted, ref, watch } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import { BulkyBazaarItem, BulkyFilter, TotalPrice } from '@shared/types/bulky.types'
import BazaarOfferItemAtom from '../atoms/BazaarOfferItemAtom.vue'
import PriceAtom from '../atoms/PriceAtom.vue'

// PROPS
const props = defineProps<{
	items: BulkyBazaarItem[]
	filter: BulkyFilter
	price: TotalPrice
}>()

// STATE
const expanded = ref(!props.filter.fullBuyout)

// WATCHERS
watch(
	() => props.filter.fullBuyout,
	bool => {
		expanded.value = !bool
	}
)

// GETTERS
const gridTemplateColumns = computed(() => {
	return props.filter.fullBuyout
		? 'fit-content(25ch) minmax(2.5ch, 1fr) 1ch fit-content(3.5ch) 24px'
		: 'fit-content(25ch) minmax(4ch, 1fr) fit-content(2.5ch) 0.75ch fit-content(2.75ch) 24px'
})

// HOOKS
const hooks = useListTransition({
	duration: 0.35,
})

onMounted(() => {
	expanded.value = !props.filter.fullBuyout
})
</script>

<style scoped>
.item-list {
	display: grid;
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.2rem;
	margin-top: 0.5rem;
	max-height: 8rem;
	overflow-y: auto;
	scrollbar-gutter: stable;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto 1fr;
	align-items: center;
	gap: 0.25rem;
}

.header .price {
	justify-self: end;
	margin-right: 5px;
}
</style>
