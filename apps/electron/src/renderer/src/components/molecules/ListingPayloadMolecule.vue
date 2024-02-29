<template>
	<div class="m-listing-payload">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3>Listings</h3>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<ul class="payload-list">
				<TransitionAtom :group="true" v-on="hooks">
					<ListItemListingPayloadAtom
						v-for="item in filteredPayloadDisplayItem"
						:full-buyout-watcher="fullBuyoutWatcher"
						:computed-payload-display-item="item" />
				</TransitionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>

		<div class="total">
			<div class="name">Total:</div>
			<div class="price">
				<div class="price-fragment divine" v-if="totalPrice.divine > 0">
					{{ totalPrice.divine }}
					<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
				</div>
				<div class="price-fragment chaos" v-if="totalPrice.chaos > 0">
					{{ totalPrice.chaos }}
					<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FilteredPayloadDisplayItem, TotalPrice } from '@web/types/bulky.types'
import ListItemListingPayloadAtom from '../atoms/ListItemListingPayloadAtom.vue'
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { computed, onMounted, ref, watch } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'

// PROPS
const props = defineProps<{
	fullBuyoutWatcher: boolean
	filteredPayloadDisplayItem: FilteredPayloadDisplayItem[]
	totalPrice: TotalPrice
}>()

// STATE
const expanded = ref(!props.fullBuyoutWatcher)

// WATCHERS
watch(
	() => props.fullBuyoutWatcher,
	bool => {
		expanded.value = !bool
	}
)

// GETTERS
const gridTemplateColumns = computed(() => {
	return props.fullBuyoutWatcher
		? 'minmax(0, 20ch) 4ch 3.5ch 1ch 3.5ch 24px'
		: 'minmax(0, 20ch) 4ch 4ch 2.5ch 0.75ch 2.75ch 24px'
})

// HOOKS
const hooks = useListTransition({
	duration: 0.35,
})

onMounted(() => {
	expanded.value = !props.fullBuyoutWatcher
})
</script>

<style scoped>
.m-listing-payload {
	float: right;
}
.payload-list {
	display: grid;
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.2rem;
	transition: grid-template-columns 2s ease;
	margin-top: 0.5rem;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
}

.total {
	display: grid;
	grid-template-columns: 1fr max-content max-content;
	margin-top: 0.5rem;
}

.price {
	height: 1.6em;
	display: grid;
	grid-template-columns: subgrid;
	gap: 0.5rem;
	grid-column: span 2;
}

.chaos {
	display: grid;
	grid-template-columns: auto 24px;
	grid-column: 3/4;
	text-align: end;
	gap: 0.15rem;
}

.divine {
	display: grid;
	grid-template-columns: auto auto;
	justify-content: end;
}
</style>
