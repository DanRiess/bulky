import { computed } from 'vue'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { BulkyOfferStore, ComputedBulkyOfferStore } from '@shared/types/bulky.types'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? 15000)

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useComputedOffersStore() {
	const appStateStore = useAppStateStore()
	const essenceOfferStore = useEssenceOfferStore()

	return computed<ComputedBulkyOfferStore>(() => {
		let store: BulkyOfferStore | undefined
		let offers: BulkyOfferStore['offers'] | undefined

		if (appStateStore.selectedCategory === 'ESSENCE') {
			store = essenceOfferStore
			offers = store.offers
		} else {
			offers = new Map()
		}

		/**
		 * Interval function. Call this every x seconds. Define the interval in the .env file.
		 * Refetch offers from the currently selected store.
		 */
		function refetchOffers() {
			// Fetch new offers
			if (store) store.refetchOffers()

			// Call this function again after x seconds.
			setTimeout(refetchOffers, REFETCH_INTERVAL)
		}

		refetchOffers()

		return {
			offers,
		}
	})
}
