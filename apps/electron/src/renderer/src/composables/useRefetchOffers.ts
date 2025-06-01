import { Category } from '@shared/types/bulky.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { BULKY_FACTORY } from '@web/utility/factory'
import { onMounted, onUnmounted, watch } from 'vue'
import { useCountdownTimer } from './useCountdownTimer'
import { useConfigStore } from '@web/stores/configStore'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'

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

	// METHODS

	/**
	 * Interval function. Call this every x seconds. Define the interval in the .env file.
	 * Refetch offers from the currently selected store.
	 */
	async function refetchOffers(category: Category, league: string) {
		// Fetch new offers.
		const store = BULKY_FACTORY.getOfferStore(category)
		if (!store || !appStateStore.appActive) {
			if (configStore.config.autoRefetchOffers) {
				resetCountdown({
					timeRemaining: REFETCH_INTERVAL / 1000,
					cb: refetchOffers.bind(null, category, league),
				})
			}
			return
		}

		// If timestamps for the current league don't exist, create them.
		if (!store.requestTimestamps[league]) {
			store.requestTimestamps[league] = { lastFetchAttempt: 0, lastSuccessfulFetch: 0 }
		}

		// Snapshot the timestamp so that no offers will be lost due to processing.
		const now = Date.now()
		const requestTimestamps = store.requestTimestamps[league]

		const lastSuccessfulFetch = requestTimestamps?.lastSuccessfulFetch ?? 0
		requestTimestamps.lastFetchAttempt = now

		// For now, instantiate a new request each time this function is called.
		// If there are problems with too many parallel requests, start working with abort controllers.
		const request = useApi('refetchOffer', nodeApi.getOffers)
		await request.exec(category, league, lastSuccessfulFetch)

		// If the request threw an error or no data was obtained, reset the countdown.
		if (request.error.value || !request.data.value) {
			if (configStore.config.autoRefetchOffers) {
				resetCountdown({
					timeRemaining: REFETCH_INTERVAL / 1000,
					cb: refetchOffers.bind(null, category, league),
				})
			}
			return
		}

		requestTimestamps.lastSuccessfulFetch = now
		request.data.value.forEach(offerDto => store.putOffer(offerDto))

		// Call this function again after x seconds.
		if (configStore.config.autoRefetchOffers) {
			resetCountdown({
				timeRemaining: REFETCH_INTERVAL / 1000,
				cb: refetchOffers.bind(null, category, league),
			})
		}
	}

	// COUNTDOWN
	const { timeRemaining, resetCountdown } = useCountdownTimer(
		REFETCH_INTERVAL / 1000,
		refetchOffers.bind(null, appStateStore.selectedCategory, configStore.config.league)
	)

	// HOOKS
	onMounted(() => {
		/**
		 * When the category changes, reset the countdown.
		 * This watcher does not need to track leagues at the moment.
		 * Leagues can only be changed in the settings where this composable cannot be instantiated.
		 */
		watch(
			() => appStateStore.selectedCategory,
			category => {
				const store = BULKY_FACTORY.getOfferStore(category)
				if (!store) return

				const league = configStore.config.league
				const lastFetchAttempt = store.requestTimestamps[league]?.lastFetchAttempt ?? 0

				// Calculate time remaining
				const timeRemaining = Date.now() - lastFetchAttempt

				// If time remaining is larger than the refetch interval, refetch immediately.
				// Else, update the countdown with the calculated time remaining and the new category.
				if (timeRemaining > REFETCH_INTERVAL) {
					refetchOffers(category, league)
				} else {
					// Don't auto fetch at this time
					// resetCountdown({
					// 	timeRemaining: Math.round((REFETCH_INTERVAL - timeRemaining) / 1000),
					// 	cb: refetchOffers.bind(null, category, league),
					// })
				}
			},
			{ immediate: true }
		)

		/**
		 * Whenever the autoRefetchOffers toggle changes, reset or reinitialize the countdown.
		 */
		watch(
			() => configStore.config.autoRefetchOffers,
			refetch => {
				if (refetch === false) {
					resetCountdown()
				} else {
					const store = BULKY_FACTORY.getOfferStore(appStateStore.selectedCategory)
					if (!store) return

					const league = configStore.config.league
					const lastFetchAttempt = store.requestTimestamps[league]?.lastFetchAttempt ?? 0

					// Calculate time remaining
					const timeRemaining = Date.now() - lastFetchAttempt

					// If time remaining is larger than the refetch interval, refetch immediately.
					// Else, update the countdown with the calculated time remaining and the new category.
					if (timeRemaining > REFETCH_INTERVAL) {
						refetchOffers(appStateStore.selectedCategory, league)
					} else {
						resetCountdown({
							timeRemaining: Math.round((REFETCH_INTERVAL - timeRemaining) / 1000),
							cb: refetchOffers.bind(null, appStateStore.selectedCategory, league),
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
		refetchOffers,
	}
}
