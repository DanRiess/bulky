import { Category } from '@shared/types/bulky.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { BULKY_FACTORY } from '@web/utility/factory'
import { onMounted, onUnmounted, watch } from 'vue'

const REFETCH_INTERVAL = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

/**
 * Registers and unregisters a watcher that refetches offers whenever the category changes.
 * The refetch function calls itself after 15s if the category doesn't change.
 * Use this in components where offers should auto update.
 */
export function useRefetchOffers() {
	const appStateStore = useAppStateStore()
	let timeout: NodeJS.Timeout | undefined

	/**
	 * Interval function. Call this every x seconds. Define the interval in the .env file.
	 * Refetch offers from the currently selected store.
	 */
	function refetchOffers(category: Category) {
		// Call this function again after x seconds.
		timeout = setTimeout(refetchOffers.bind(null, category), REFETCH_INTERVAL)

		// If the app is inactive, don't refetch.
		if (!appStateStore.appActive) return

		// Fetch new offers.
		const store = BULKY_FACTORY.getOfferStore(category)
		if (store) store.refetchOffers()
	}

	onMounted(() => {
		watch(
			() => appStateStore.selectedCategory,
			category => {
				// Clear the timeout if it exists
				clearTimeout(timeout)
				refetchOffers(category)
			},
			{ immediate: true }
		)
	})

	// Clear the timeout whenever the parent component unmounts
	onUnmounted(() => {
		clearTimeout(timeout)
	})
}
