/**
 * Handle all fragment offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BazaarFragment, BazaarFragmentOffer } from './fragment.types'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { FRAGMENT_SET, FRAGMENT_TYPE } from './fragment.const'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'

export const useFragmentOfferStore = defineStore('fragmentOfferStore', () => {
	// STATE
	const offers = ref<Map<BazaarFragmentOffer['uuid'], BazaarFragmentOffer>>(new Map())
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume a fragment listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'FRAGMENT') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarFragmentOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('FRAGMENT', item) as BazaarFragment)
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
	function deleteOffer(uuid: BazaarFragmentOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarFragment) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarFragment or not.
	 */
	function isFragment(obj: any): obj is BazaarFragment {
		return (
			obj &&
			'type' in obj &&
			(getKeys(FRAGMENT_TYPE).includes(obj.type) || getKeys(FRAGMENT_SET).includes(obj.type)) &&
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
		isFragment,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFragmentOfferStore, import.meta.hot))
}
