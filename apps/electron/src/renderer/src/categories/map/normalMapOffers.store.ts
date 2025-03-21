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

export const useNormalMapOfferStore = defineStore('normalMapOfferStore', () => {
	// STATE
	const offers = ref<Map<BazaarMapOffer['uuid'], BazaarMapOffer>>(new Map())
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume an map listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMapOffer>(dto.uuid)
		const account = dto.account
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items.map(item => BULKY_FACTORY.generateBazaarItemFromDto('MAP', item) as BazaarMap).filter(notEmpty)
		if (!items || !multiplier || !fullPrice || !ign || !league || !chaosPerDiv) return

		// Delete previous offers if they are from the same account.
		for (const offer of offers.value.values()) {
			if (offer.account === account && offer.league === league) {
				offers.value.delete(offer.uuid)
			}
		}

		offers.value.set(uuid, {
			category,
			account,
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
	function deleteOffer(uuid: BazaarMapOffer['uuid']) {
		offers.value.delete(uuid)
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
		offers,
		requestTimestamps,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isNormalMap,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNormalMapOfferStore, import.meta.hot))
}
