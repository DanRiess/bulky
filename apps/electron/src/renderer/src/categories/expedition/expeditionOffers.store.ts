/**
 * Handle all expedition offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { useApi } from '@web/api/useApi'
import { notEmpty } from '@web/utility/notEmpty'
import { BazaarExpeditionItem, BazaarExpeditionOffer } from './expedition.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { EXPEDITION_TIER, EXPEDITION_TYPE } from './expedition.const'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'

export const useExpeditionOfferStore = defineStore('expeditionOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarExpeditionOffer['uuid'], BazaarExpeditionOffer>>(new Map())
	const fetchRequest = useApi('fetchExpedition', nodeApi.getOffers)
	const lastFetched = ref(0)

	/**
	 * Consume an expedition listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'EXPEDITION') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarExpeditionOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout ?? 0
		const fullPrice = dto.fullPrice
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('EXPEDITION', item) as BazaarExpeditionItem)
			.filter(notEmpty)
		if (!items || !multiplier || !fullPrice || !ign || !league || !chaosPerDiv) return

		offers.value.set(uuid, {
			category,
			uuid,
			ign,
			league,
			chaosPerDiv,
			items,
			fullPrice,
			minimumBuyout,
			contact: {
				messageSent: false,
				timestamp: 0,
			},
			multiplier,
		})
	}

	/**
	 * Delete an offer. Will be called if it's expired.
	 */
	function deleteOffer(uuid: BazaarExpeditionOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarExpeditionItem) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarExpeditionItem or not.
	 */
	function isExpeditionItem(obj: any): obj is BazaarExpeditionItem {
		return (
			obj &&
			'type' in obj &&
			getKeys(EXPEDITION_TYPE).includes(obj.type) &&
			'tier' in obj &&
			getKeys(EXPEDITION_TIER).includes(obj.tier) &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	/**
	 * Fetch all new expedition offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		const refetchInterval = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

		if (Date.now() - lastFetched.value < refetchInterval) return
		if (fetchRequest.statusPending.value) return

		await fetchRequest.exec('EXPEDITION', configStore.config.league, lastFetched.value)

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
		isExpeditionItem,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useExpeditionOfferStore, import.meta.hot))
}
