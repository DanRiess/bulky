import { computed, onUnmounted } from 'vue'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { BulkyOfferStore, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? 15000)

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useComputedOffersStore() {
	const appStateStore = useAppStateStore()
	const essenceOfferStore = useEssenceOfferStore()
	const scarabOfferStore = useScarabOfferStore()

	let timeout: NodeJS.Timeout | undefined
	onUnmounted(() => {
		clearTimeout(timeout)
	})

	return computed<ComputedBulkyOfferStore>(() => {
		let store: BulkyOfferStore | undefined
		let offers: BulkyOfferStore['offers'] | undefined

		if (appStateStore.selectedCategory === 'ESSENCE') {
			store = essenceOfferStore
		} else if (appStateStore.selectedCategory === 'SCARAB') {
			store = scarabOfferStore
		}

		offers = store ? store.offers : new Map()

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
