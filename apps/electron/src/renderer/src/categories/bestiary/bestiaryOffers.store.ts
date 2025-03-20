/**
 * Handle all bestiary offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BEAST_TYPE } from './bestiary.const'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { BazaarBeast, BazaarBestiaryOffer } from './bestiary.types'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'

export const useBestiaryOfferStore = defineStore('bestiaryOfferStore', () => {
	// STATE
	const offers = ref<Map<BazaarBestiaryOffer['uuid'], BazaarBestiaryOffer>>(new Map())
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume an bestiary listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'BESTIARY') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarBestiaryOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('BESTIARY', item) as BazaarBeast)
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
	function deleteOffer(uuid: BazaarBestiaryOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarBeast) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarBeast or not.
	 */
	function isBeast(obj: any): obj is BazaarBeast {
		return (
			obj &&
			'type' in obj &&
			getKeys(BEAST_TYPE).includes(obj.type) &&
			'tier' in obj &&
			obj.tier === '0' &&
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
		isBeast,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useBestiaryOfferStore, import.meta.hot))
}
