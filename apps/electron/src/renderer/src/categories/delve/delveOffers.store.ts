/**
 * Handle all delve offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BazaarDelveItem, BazaarDelveOffer } from './delve.types'
import { DELVE_TYPE } from './delve.const'
import { useConfigStore } from '@web/stores/configStore'
import { nodeApi } from '@web/api/nodeApi'

export const useDelveOfferStore = defineStore('delveOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarDelveOffer['uuid'], BazaarDelveOffer>>(new Map())
	const fetchRequest = useApi('fetchDelve', nodeApi.getOffers)
	const lastFetched = ref(0)

	/**
	 * Consume a delve offer dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'DELVE') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarDelveOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('DELVE', item) as BazaarDelveItem)
			.filter(Boolean)
		if (!items || !multiplier || !fullPrice || !ign || !league || !chaosPerDiv) return

		offers.value.set(uuid, {
			category,
			uuid,
			ign,
			league,
			chaosPerDiv,
			multiplier,
			fullPrice,
			items,
			minimumBuyout,
			contact: {
				messageSent: false,
				timestamp: 0,
			},
		})
	}

	/**
	 * Delete an offer. Will be called if it's expired.
	 */
	function deleteOffer(uuid: BazaarDelveOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarDelveItem) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarScarab or not.
	 */
	function isDelveItem(obj: any): obj is BazaarDelveItem {
		return (
			obj &&
			'type' in obj &&
			getKeys(DELVE_TYPE).includes(obj.type) &&
			'tier' in obj &&
			obj.tier === '0' &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	/**
	 * Fetch all new scarab offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		const refetchInterval = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

		if (Date.now() - lastFetched.value < refetchInterval) return
		if (fetchRequest.statusPending.value) return

		await fetchRequest.exec('DELVE', configStore.config.league, lastFetched.value)

		// If the request threw an error or no data was obtained, just return.
		if (fetchRequest.error.value || !fetchRequest.data.value) return

		lastFetched.value = Date.now()
		fetchRequest.data.value.forEach(offerDto => putOffer(offerDto))
	}

	return {
		offers,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isDelveItem,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDelveOfferStore, import.meta.hot))
}
