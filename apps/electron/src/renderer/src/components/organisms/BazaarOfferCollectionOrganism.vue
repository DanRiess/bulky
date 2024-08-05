<template>
	<ul class="o-listing flow" ref="listElement">
		<TransitionAtom group v-on="hooks">
			<FallbackBazaarOfferMolecule v-if="filteredOffers.size === 0" />
			<BazaarOfferOrganism
				v-for="([_, offer], idx) in offersToDisplay"
				:key="offer.uuid"
				:offer="offer"
				:idx="idx"
				:price-compute-fn="store.calculateItemBasePrice"
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
import { computed, ref } from 'vue'
import { useEventListener } from '@web/composables/useEventListener'
import { debounce } from 'lodash'

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
const filteredOffers = computed<Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer>>(() => {
	const offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer> = new Map()

	props.store.offers.forEach((offer: BulkyBazaarOffer) => {
		// Filter out all offers whose multipliers are too high.
		// The maximum possible multiplier (2) should display all offers though.
		// An offer can have a higher multiplier than 2 if some of its items were overridden with higher prices.
		if (props.filter.multiplier && props.filter.multiplier < 2 && props.filter.multiplier < offer.multiplier) return

		// If the user wants to buyout the full offer, return the offer.
		if (props.filter.fullBuyout) {
			offers.set(offer.uuid, offer)
			return
		}

		// Since we have to loop over the filter fields anyway, calculate their price.
		let price = 0

		// If an offer does not contain the necessary items, set this variable to true and return.
		let itemsMissingInOffer = false

		// Remove duplicate filter fields
		const seen = {} as Record<string, boolean>
		const computedFilterFields = props.filter.fields.filter(field => {
			const name = `${field.type}-${field.tier}`
			return seen.hasOwnProperty(name) ? false : (seen[name] = true)
		})

		// Filter out offers that have a higher 'minimumBuyout' than what the filter provides.
		for (let i = 0; i < computedFilterFields.length; ++i) {
			const field = computedFilterFields[i]
			const item = offer.items.find(item => item.type === field.type && item.tier === field.tier)
			if (item) {
				try {
					const basePrice = props.store.calculateItemBasePrice(item, props.filter)
					price += props.filter.alwaysMaxQuantity ? basePrice * item.quantity : basePrice * field.quantity
				} catch (e) {
					itemsMissingInOffer = true
				}
			} else {
				itemsMissingInOffer = true
				break
			}
		}

		// If at least one item does not exist in the offer, return.
		if (itemsMissingInOffer) return

		// If the calculated price is smaller than the minimum buyout, return.
		if (price < offer.minimumBuyout) return

		// If all checks have passed, add the offer to the map.
		offers.set(offer.uuid, offer)
	})

	return offers
})

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
