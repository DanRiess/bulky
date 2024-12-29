/**
 * Handle all catalyst offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { notEmpty } from '@web/utility/notEmpty'
import { BazaarCatalyst, BazaarCatalystOffer } from './catalyst.types'
import { CATALYST_TYPE } from './catalyst.const'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'

export const useCatalystOfferStore = defineStore('catalystOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarCatalystOffer['uuid'], BazaarCatalystOffer>>(new Map())
	const fetchRequest = useApi('fetchCatalysts', nodeApi.getOffers)
	const lastFetched = ref(0)

	/**
	 * Consume a catalyst listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'CATALYST') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarCatalystOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('CATALYST', item) as BazaarCatalyst)
			.filter(notEmpty)

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
	function deleteOffer(uuid: BazaarCatalystOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarCatalyst) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarCatalyst or not.
	 */
	function isCatalyst(obj: any): obj is BazaarCatalyst {
		return (
			obj &&
			'type' in obj &&
			getKeys(CATALYST_TYPE).includes(obj.type) &&
			'tier' in obj &&
			obj.tier === '0' &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	/**
	 * Fetch all new catalyst offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		const refetchInterval = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

		if (Date.now() - lastFetched.value < refetchInterval) return
		if (fetchRequest.statusPending.value) return

		await fetchRequest.exec('CATALYST', configStore.config.league, lastFetched.value)

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
		isCatalyst,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCatalystOfferStore, import.meta.hot))
}
