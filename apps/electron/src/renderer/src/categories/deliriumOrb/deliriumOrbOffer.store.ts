/**
 * Handle all delirium orb offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BazaarDeliriumOrb, BazaarDeliriumOrbOffer } from './deliriumOrb.types'
import { DELI_ORB_TYPE } from './deliriumOrb.const'
import { BULKY_FACTORY } from '@web/utility/factory'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'

export const useDeliriumOrbOfferStore = defineStore('deliriumOrbOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarDeliriumOrbOffer['uuid'], BazaarDeliriumOrbOffer>>(new Map())
	const fetchRequest = useApi('fetchDeliriumOrbs', nodeApi.getOffers)
	const lastFetched = ref(0)

	/**
	 * Consume an delirium orb offer dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'DELIRIUM_ORB') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarDeliriumOrbOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('MAP', item) as BazaarDeliriumOrb)
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
	function deleteOffer(uuid: BazaarDeliriumOrbOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarDeliriumOrb) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarScarab or not.
	 */
	function isDeliriumOrb(obj: any): obj is BazaarDeliriumOrb {
		return (
			obj &&
			'type' in obj &&
			getKeys(DELI_ORB_TYPE).includes(obj.type) &&
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

		await fetchRequest.exec('DELIRIUM_ORB', configStore.config.league, lastFetched.value)

		// If the request threw an error or no data was obtained, just return.
		if (fetchRequest.error.value || !fetchRequest.data.value) return

		lastFetched.value = Date.now()
		fetchRequest.data.value.forEach(offerDto => putOffer(offerDto))
	}

	return {
		offers,
		lastFetched,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isDeliriumOrb,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDeliriumOrbOfferStore, import.meta.hot))
}
