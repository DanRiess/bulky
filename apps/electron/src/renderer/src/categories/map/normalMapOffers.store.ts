/**
 * Handle all map offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { MAP_TIER, MAP_TYPE } from './map.const'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { BazaarMap, BazaarMapOffer } from './map.types'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import { useDebouncedReactiveMap } from '@web/composables/useDebouncedOfferStore'

export const useNormalMapOfferStore = defineStore('normalMapOfferStore', () => {
	// STATE
	// const offers = ref<Map<BazaarMapOffer['uuid'], BazaarMapOffer>>(new Map())
	const { _offers, offers, queueSet, queueDelete } = useDebouncedReactiveMap<BazaarMapOffer['uuid'], BazaarMapOffer>()
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume an map listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP') return

		// Don't process the offer if it's older than 10 minutes.
		if (
			import.meta.env.VITE_IGNORE_OFFER_TTL === 'false' &&
			Date.now() > dto.timestamp + Number(import.meta.env.VITE_OFFER_TTL)
		)
			return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMapOffer>(dto.uuid)
		const account = dto.account
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const timestamp = dto.timestamp
		const items = dto.items.map(item => BULKY_FACTORY.generateBazaarItemFromDto('MAP', item) as BazaarMap).filter(notEmpty)
		if (!items || !multiplier || !fullPrice || !ign || !league || !chaosPerDiv) return

		// Delete previous offers if they are from the same account.
		for (const offer of offers.value.values()) {
			if (offer.account === account && offer.league === league) {
				// offers.value.delete(offer.uuid)
				queueDelete(offer.uuid)
			}
		}

		const newOffer = {
			category,
			account,
			uuid,
			ign,
			league,
			timestamp,
			chaosPerDiv,
			multiplier,
			fullPrice,
			items,
			minimumBuyout,
			contact: {
				messageSent: false,
				timestamp: 0,
			},
		}

		queueSet(uuid, newOffer)
	}

	/**
	 * Delete an offer. Will be called if it's expired.
	 */
	function deleteOffer(uuid: BazaarMapOffer['uuid']) {
		// offers.value.delete(uuid)
		queueDelete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarMap) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarMap or not.
	 */
	function isNormalMap(obj: any): obj is BazaarMap {
		return (
			obj &&
			'type' in obj &&
			getKeys(MAP_TYPE).includes(obj.type) &&
			'tier' in obj &&
			getKeys(MAP_TIER).includes(obj.tier) &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	return {
		_offers,
		offers,
		requestTimestamps,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isNormalMap,
		queueSet,
		queueDelete,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNormalMapOfferStore, import.meta.hot))
}
