/**
 * Handle all expedition offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BazaarExpeditionItem, BazaarExpeditionOffer } from './expedition.types'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { EXPEDITION_TIER, EXPEDITION_TYPE } from './expedition.const'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'

export const useExpeditionOfferStore = defineStore('expeditionOfferStore', () => {
	// STATE
	const offers = ref<Map<BazaarExpeditionOffer['uuid'], BazaarExpeditionOffer>>(new Map())
	const requestTimestamps = ref<OfferRequestTimestamps>({})

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

	return {
		offers,
		requestTimestamps,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isExpeditionItem,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useExpeditionOfferStore, import.meta.hot))
}
