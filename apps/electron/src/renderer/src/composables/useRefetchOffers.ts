import { Category } from '@shared/types/bulky.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { BULKY_FACTORY } from '@web/utility/factory'
import { computed, ComputedRef, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCountdownTimer } from './useCountdownTimer'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { useBestiaryOfferStore } from '@web/categories/bestiary/bestiaryOffers.store'
import { useCatalystOfferStore } from '@web/categories/catalyst/catalystOffers.store'
import { useCurrencyOfferStore } from '@web/categories/currency/currencyOffers.store'
import { useDelveOfferStore } from '@web/categories/delve/delveOffers.store'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import { useExpeditionOfferStore } from '@web/categories/expedition/expeditionOffers.store'
import { useFragmentOfferStore } from '@web/categories/fragment/fragmentOffers.store'
import { useHeistOfferStore } from '@web/categories/heist/heistOffers.store'
import { useNormalMapOfferStore } from '@web/categories/map/normalMapOffers.store'
import { useMap8ModOfferStore } from '@web/categories/map/map8ModOffers.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { useConfigStore } from '@web/stores/configStore'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

/**
 * Registers and unregisters a watcher that refetches offers whenever the category changes.
 * The refetch function calls itself after 15s if the category doesn't change.
 * Use this in components where offers should auto update.
 */
export function useRefetchOffers() {
	// STORES
	const appStateStore = useAppStateStore()
	const configStore = useConfigStore()

	// INTERNAL STATE
	const lastFetched = ref<Record<Category, number>>({
		BESTIARY: computed(() => useBestiaryOfferStore().lastFetched) as unknown as number,
		CATALYST: computed(() => useCatalystOfferStore().lastFetched) as unknown as number,
		CURRENCY: computed(() => useCurrencyOfferStore().lastFetched) as unknown as number,
		DELIRIUM_ORB: computed(() => useDeliriumOrbOfferStore().lastFetched) as unknown as number,
		DELVE: computed(() => useDelveOfferStore().lastFetched) as unknown as number,
		ESSENCE: computed(() => useEssenceOfferStore().lastFetched) as unknown as number,
		EXPEDITION: computed(() => useExpeditionOfferStore().lastFetched) as unknown as number,
		FRAGMENT: computed(() => useFragmentOfferStore().lastFetched) as unknown as number,
		HEIST: computed(() => useHeistOfferStore().lastFetched) as unknown as number,
		MAP: computed(() => useNormalMapOfferStore().lastFetched) as unknown as number,
		MAP_8_MOD: computed(() => useMap8ModOfferStore().lastFetched) as unknown as number,
		SCARAB: computed(() => useScarabOfferStore().lastFetched) as unknown as number,
	})

	/**
	 * Interval function. Call this every x seconds. Define the interval in the .env file.
	 * Refetch offers from the currently selected store.
	 */
	async function refetchOffers(category: Category) {
		// If the app is inactive, don't refetch.
		if (!appStateStore.appActive) return

		// Fetch new offers.
		const store = BULKY_FACTORY.getOfferStore(category)
		if (store) await store.refetchOffers()

		// Call this function again after x seconds.
		resetCountdown({ timeRemaining: REFETCH_INTERVAL / 1000, cb: refetchOffers.bind(null, category) })
	}

	const { timeRemaining, resetCountdown } = useCountdownTimer(
		REFETCH_INTERVAL / 1000,
		refetchOffers.bind(null, appStateStore.selectedCategory)
	)

	onMounted(() => {
		watch(
			() => appStateStore.selectedCategory,
			category => {
				// Calculate time remaining
				const timeRemaining = Date.now() - lastFetched.value[category]

				// If time remaining is larger than the refetch interval, refetch immediately.
				// Else, update the countdown with the calculated time remaining and the new category.
				if (timeRemaining > REFETCH_INTERVAL) {
					refetchOffers(category)
				} else {
					resetCountdown({ timeRemaining: Math.round(timeRemaining / 1000), cb: refetchOffers.bind(null, category) })
				}
			},
			{ immediate: true }
		)

		watch(
			() => configStore.config.autoRefetchOffers,
			refetch => {
				if (refetch === false) {
					resetCountdown()
				} else {
					// Calculate time remaining
					const timeRemaining = Date.now() - lastFetched.value[appStateStore.selectedCategory]

					// If time remaining is larger than the refetch interval, refetch immediately.
					// Else, update the countdown with the calculated time remaining and the new category.
					if (timeRemaining > REFETCH_INTERVAL) {
						refetchOffers(appStateStore.selectedCategory)
					} else {
						resetCountdown({
							timeRemaining: Math.round(timeRemaining / 1000),
							cb: refetchOffers.bind(null, appStateStore.selectedCategory),
						})
					}
				}
			}
		)
	})

	// Clear the countdown whenever the parent component unmounts
	onUnmounted(() => {
		resetCountdown()
	})

	return {
		timeRemaining,
	}
}
