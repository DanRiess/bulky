import { ApiStatus } from '@web/api/api.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { sleepTimer } from '@web/utility/sleep'

/**
 * This store exposes necessary global PoE Ninja data.
 * Currently, that is only chaos per div.
 * DO NOT use this to get price info for a shop offer.
 * That MUST be done via the usePoeNinja composable.
 */
export const useNinjaStore = defineStore('ninjaStore', () => {
	// INTERNAL STATE
	const UPDATE_INTERVAL = 30 * 60 * 1000

	// EXPOSED STATE
	// const prices = ref<NinjaPriceRecord>(new Map())
	const loadingStatus = ref<ApiStatus>('IDLE')
	const chaosPerDiv = ref(0)

	/**
	 * Reload currency prices every 30 minutes.
	 */
	setInterval(() => {
		loadingStatus.value = 'PENDING'

		getChaosPerDiv()
			.then(() => (loadingStatus.value = 'SUCCESS'))
			.catch(() => (loadingStatus.value = 'ERROR'))
	}, UPDATE_INTERVAL)

	// METHODS

	/**
	 * This function will get the current chaos per div ratio.
	 * If the idb value is older than 30 minutes, it will automatically update it.
	 */
	async function getChaosPerDiv() {
		const { prices, loadingStatus } = usePoeNinja('CURRENCY')

		while (loadingStatus.value === 'PENDING') {
			await sleepTimer(100)
		}

		const divine = prices.value.get('divine')
		if (!divine) return 0

		return divine.chaos
	}

	return {
		// prices,
		loadingStatus,
		chaosPerDiv,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNinjaStore, import.meta.hot))
}
