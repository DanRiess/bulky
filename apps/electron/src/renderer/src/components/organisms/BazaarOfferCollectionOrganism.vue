<template>
	<ul class="o-listing flow" ref="listElement">
		<TransitionAtom group v-on="hooks">
			<FallbackBazaarOfferMolecule v-if="filteredOffers.size === 0" />
			<BazaarOfferOrganism
				v-for="([_, offer], idx) in offersToDisplay"
				:key="offer.uuid"
				:offer="offer"
				:idx="idx"
				:price-compute-fn="store.calculateBaseItemPrice"
				:filter="filter"
				:data-index="idx" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import FallbackBazaarOfferMolecule from '../molecules/fallbacks/FallbackBazaarOfferMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import { BulkyBazaarOffer, BulkyFilter, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import BazaarOfferOrganism from './BazaarOfferOrganism.vue'
import { computed, ref, watch } from 'vue'
import { useEventListener } from '@web/composables/useEventListener'
import { debounce } from 'lodash-es'
import { useFilterOffers } from '@web/composables/useFilterOffers'

//PROPS
const props = defineProps<{
	store: ComputedBulkyOfferStore
	filter: BulkyFilter
}>()

// STATE
const listElement = ref<HTMLElement>()
const amountRendered = ref(6)

// COMPOSABLES
const hooks = useListTransition()
useEventListener(listElement, 'scroll', debounce(onScroll, 50))

// GETTERS
/**
 * Apply the filter to offers to filter out non-applicable ones.
 */
// const filteredOffers = useApplyFilterToOffers(
// 	() => props.store,
// 	() => props.filter
// )
const { filteredOffers } = useFilterOffers()

/**
 * Creates a sub-map of filtered offers that only contains elements that should be rendered.
 * Maps unfortunately don't support index getters, so cannot just loop over amountRendered.
 *
 * This is inefficient, since every time the user scrolls to the bottom, the entire map is getting recalculated.
 * If performance issues appear, change this into a ref and work with a watcher that observes 'amountRendered'.
 */
const offersToDisplay = computed(() => {
	const offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer> = new Map()

	const keys = Array.from(filteredOffers.value.keys()).filter((_, idx) => idx < amountRendered.value)

	keys.forEach(key => {
		const value = filteredOffers.value.get(key)
		if (value) {
			offers.set(key, value)
		}
	})

	return offers
})

// WATCHERS
/**
 * Watch variables that should reset the amountRendered variable
 */
watch([() => props.store], () => (amountRendered.value = 6))

// METHODS
function onScroll() {
	if (!listElement.value) return

	const scrollHeight = listElement.value.scrollHeight
	const offset = listElement.value.scrollTop
	const renderedHeight = listElement.value.offsetHeight

	// Load more content if scrolled to the bottom
	if (renderedHeight + offset >= scrollHeight * 0.8) {
		amountRendered.value += 6
	}
}
</script>

<style scoped>
.o-listing {
	overflow: auto;
	border-radius: var(--border-radius-small);
	padding-right: 0.5rem;
}

.o-listing > .m-listing-item:not(:first-child) {
	margin-top: 1rem;
}
</style>
