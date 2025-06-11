// Combine Computedofferstore and useapplyfilter

import { computed, nextTick, watch } from 'vue'
import { useDebouncedReactiveMap } from './useDebouncedOfferStore'
import { refDebounced } from '@vueuse/core'
import { filterOffer } from '@web/utility/filterOffer'
import { BULKY_REGEX } from '@web/utility/regex'
import { useComputedOffersStore } from './useComputedOffersStore'
import { useComputedFilterStore } from './useComputedFilterStore'

export function useFilterOffers() {
	// STATE
	const offerStore = useComputedOffersStore()
	const filterStore = useComputedFilterStore()
	const { offers: filteredOffers, queueSet, queueDelete } = useDebouncedReactiveMap({ debounceMs: 50, id: 'useFilter' })
	let isRecalculating = false

	// Split the filter into debounced and immediate props.
	const debouncedRegex = refDebounced(
		computed(() => filterStore.value?.filter?.regex),
		250
	)

	// WATCHERS
	/**
	 * This watcher will trigger when the debounced regex changes.
	 */
	watch(
		debouncedRegex,
		(regex, oldRegex) => {
			if (regex === undefined || (regex === '' && oldRegex === undefined)) return
			isRecalculating = true

			// If there is no filter, no offer store or no base price function, something is wrong. Return for now.
			const filter = filterStore.value?.filter
			if (!filter || !offerStore) return

			const regexArray = filter.regex ? BULKY_REGEX.computeRegexesFromString(regex) : []
			const regexes = BULKY_REGEX.categorizeRegexes(regexArray)

			// Filter logic
			for (const offer of offerStore.value.offers.values()) {
				const filteredOffer = filterOffer(offer, filter, regexes, offerStore.value.calculateBaseItemPrice)

				filteredOffer ? queueSet(filteredOffer.uuid, filteredOffer) : queueDelete(offer.uuid)
			}

			nextTick(() => (isRecalculating = false))
		},
		{ deep: true }
	)

	/**
	 * This watcher triggers on immediate filter changes.
	 * It will ignore regex changes.
	 */
	watch(
		() => filterStore.value?.filter,
		(filter, oldFilter) => {
			if (!filter) return
			// Don't trigger this watcher on regex changes.
			if (filter.regex !== debouncedRegex.value) return
			if (filter.category !== oldFilter?.category) return

			isRecalculating = true

			const regexArray = filter.regex ? BULKY_REGEX.computeRegexesFromString(filter.regex) : []
			const regexes = BULKY_REGEX.categorizeRegexes(regexArray)

			// Filter logic
			for (const offer of offerStore.value.offers.values()) {
				const filteredOffer = filterOffer(offer, filter, regexes, offerStore.value.calculateBaseItemPrice)

				filteredOffer ? queueSet(filteredOffer.uuid, filteredOffer) : queueDelete(offer.uuid)
			}

			nextTick(() => (isRecalculating = false))
		},
		{ deep: true }
	)

	/**
	 * A change in the offers should only lead to a filter being applied to the changed elements.
	 */
	watch(
		() => offerStore.value.offers,
		(newOffers, oldOffers) => {
			if (newOffers.size === 0 && oldOffers?.size === 0) return
			// Skip incremental update if full recalculation is in progress during this tick.
			if (isRecalculating) return

			// Guard for initial run if immediate: true is used.
			// This lead to offers not being loaded when the component first mounted. Probably counterproductive.
			// if (!oldOffers) return

			// If there is no filter, no offer store or no base price function, something is wrong. Return for now.
			const filter = filterStore.value?.filter
			if (!filter || !offerStore) return

			const regexArray = filter.regex ? BULKY_REGEX.computeRegexesFromString(filter.regex) : []
			const regexes = BULKY_REGEX.categorizeRegexes(regexArray)

			for (const [key, newOffer] of newOffers!.entries()) {
				const oldOffer = oldOffers?.get(key)

				// Case 1: Addition
				if (!oldOffer) {
					// filter offer and queue set if pass.
					const offer = filterOffer(newOffer, filter, regexes, offerStore.value.calculateBaseItemPrice)
					offer && queueSet(offer.uuid, offer)
				}

				// Case 2: Modification
				// PERF: This could be further optimized by calculating an offer hash during upload.
				// The timestamp will change whenever the offer gets reuploaded, but that doesn't
				// necessarily mean that the offer changed. Comparing the hash would lead to less filter logic.
				else if (oldOffer.timestamp !== newOffer.timestamp) {
					// filter offer and queue set if pass, queue delete if it doesn't.
					const offer = filterOffer(newOffer, filter, regexes, offerStore.value.calculateBaseItemPrice)
					offer ? queueSet(offer.uuid, offer) : queueDelete(key)
				}
			}

			// Case 3: Deletion
			if (oldOffers) {
				for (const oldKey of oldOffers.keys()) {
					if (!newOffers.has(oldKey)) {
						queueDelete(oldKey)
					}
				}
			}
		},
		{ deep: true, immediate: true }
	)

	return {
		filteredOffers,
	}
}
