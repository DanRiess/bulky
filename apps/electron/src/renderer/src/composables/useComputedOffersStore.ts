import { computed, onUnmounted } from 'vue'

import { useAppStateStore } from '@web/stores/appStateStore'
import { BulkyBazaarItem, BulkyBazaarOffer, BulkyFilter, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import { useNormalMapOfferStore } from '@web/categories/map/normalMapOffers.store'
import { useMap8ModOfferStore } from '@web/categories/map/map8ModOffers.store'
import { RendererError } from '@shared/errors/rendererError'
import { useBestiaryOfferStore } from '@web/categories/beastiary/bestiaryOffers.store'
import { useDelveOfferStore } from '@web/categories/delve/delveOffers.store'
import { useCatalystOfferStore } from '@web/categories/catalyst/catalystOffers.store'
import { useCurrencyOfferStore } from '@web/categories/currency/currencyOffers.store'
import { useHeistOfferStore } from '@web/categories/heist/heistOffers.store'
import { useExpeditionOfferStore } from '@web/categories/expedition/expeditionOffers.store'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? 15000)

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useComputedOffersStore() {
	const appStateStore = useAppStateStore()
	const essenceOfferStore = useEssenceOfferStore()
	const scarabOfferStore = useScarabOfferStore()
	const deliriumOrbOfferStore = useDeliriumOrbOfferStore()
	const normalMapOfferStore = useNormalMapOfferStore()
	const map8ModOfferStore = useMap8ModOfferStore()
	const bestiaryOfferStore = useBestiaryOfferStore()
	const delveOfferStore = useDelveOfferStore()
	const catalystOfferStore = useCatalystOfferStore()
	const currencyOfferStore = useCurrencyOfferStore()
	const heistOfferStore = useHeistOfferStore()
	const expeditionOfferStore = useExpeditionOfferStore()

	let timeout: NodeJS.Timeout | undefined

	// Clear the timeout whenever the parent component unmounts
	onUnmounted(() => {
		clearTimeout(timeout)
	})

	return computed<ComputedBulkyOfferStore>(() => {
		// Clear the timeout if it exists
		if (timeout) {
			clearTimeout(timeout)
		}

		// Get the correct store and its offers
		const store = BULKY_FACTORY.getOfferStore(appStateStore.selectedCategory)
		const offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer> = store ? store.offers : new Map()

		/**
		 * Interval function. Call this every x seconds. Define the interval in the .env file.
		 * Refetch offers from the currently selected store.
		 */
		function refetchOffers() {
			// If the app is inactive, don't refetch.
			if (!appStateStore.appActive) return

			// Fetch new offers.
			if (store) store.refetchOffers()

			// Call this function again after x seconds.
			timeout = setTimeout(refetchOffers, REFETCH_INTERVAL)
		}
		refetchOffers()

		/**
		 * Calculates the base item price depending on category and optional filter.
		 * Uses a store function implementation.
		 *
		 * @throws {RendererError} When the item does not fit the store or the store implementation errors.
		 */
		function calculateBaseItemPrice(item: BulkyBazaarItem, filter: BulkyFilter) {
			if (store === essenceOfferStore && store.isEssence(item)) return store.calculateBaseItemPrice(item)
			else if (store === scarabOfferStore && store.isScarab(item)) return store.calculateBaseItemPrice(item)
			else if (store === deliriumOrbOfferStore && store.isDeliriumOrb(item)) return store.calculateBaseItemPrice(item)
			else if (store === normalMapOfferStore && store.isNormalMap(item)) return store.calculateBaseItemPrice(item)
			else if (store === map8ModOfferStore && store.isMap8Mod(item)) return store.calculateBaseItemPrice(item, filter)
			else if (store === bestiaryOfferStore && store.isBeast(item)) return store.calculateBaseItemPrice(item)
			else if (store === delveOfferStore && store.isDelveItem(item)) return store.calculateBaseItemPrice(item)
			else if (store === catalystOfferStore && store.isCatalyst(item)) return store.calculateBaseItemPrice(item)
			else if (store === currencyOfferStore && store.isCurrencyItem(item)) return store.calculateBaseItemPrice(item)
			else if (store === heistOfferStore && store.isHeistItem(item)) return store.calculateBaseItemPrice(item)
			else if (store === expeditionOfferStore && store.isExpeditionItem(item)) return store.calculateBaseItemPrice(item)

			throw new RendererError({
				code: 'unknown_item',
				message: 'The item does not belong to the current store.',
			})
		}

		return {
			offers,
			calculateBaseItemPrice,
		}
	})
}
