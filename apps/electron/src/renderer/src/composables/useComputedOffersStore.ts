import { computed, onUnmounted } from 'vue'

import { useAppStateStore } from '@web/stores/appStateStore'
import { BulkyOfferStore, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? 15000)

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useComputedOffersStore() {
	const appStateStore = useAppStateStore()

	let timeout: NodeJS.Timeout | undefined
	onUnmounted(() => {
		clearTimeout(timeout)
	})

	return computed<ComputedBulkyOfferStore>(() => {
		const store = BULKY_FACTORY.getOfferStore(appStateStore.selectedCategory)

		const offers: BulkyOfferStore['offers'] = store ? store.offers : new Map()

		/**
		 * Interval function. Call this every x seconds. Define the interval in the .env file.
		 * Refetch offers from the currently selected store.
		 */
		function refetchOffers() {
			// Fetch new offers
			if (store) store.refetchOffers()

			// Call this function again after x seconds.
			timeout = setTimeout(refetchOffers, REFETCH_INTERVAL)
		}

		refetchOffers()

		return {
			offers,
		}
	})
}
