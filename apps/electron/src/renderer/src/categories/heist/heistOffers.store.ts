/**
 * Handle all heist offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { HEIST_TIER, HEIST_TYPE } from './heist.const'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { BazaarHeistItem, BazaarHeistOffer } from './heist.types'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import { useDebouncedReactiveMap } from '@web/composables/useDebouncedOfferStore'

export const useHeistOfferStore = defineStore('heistOfferStore', () => {
	// STATE
	// const offers = ref<Map<BazaarHeistOffer['uuid'], BazaarHeistOffer>>(new Map())
	const { _offers, offers, queueSet, queueDelete } = useDebouncedReactiveMap<BazaarHeistOffer['uuid'], BazaarHeistOffer>()
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume an heist listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'HEIST') return

		// Don't process the offer if it's older than 10 minutes.
		if (Date.now() > dto.timestamp + Number(import.meta.env.VITE_OFFER_TTL)) return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarHeistOffer>(dto.uuid)
		const account = dto.account
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const timestamp = dto.timestamp
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('HEIST', item) as BazaarHeistItem)
			.filter(notEmpty)
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
	function deleteOffer(uuid: BazaarHeistOffer['uuid']) {
		// offers.value.delete(uuid)
		queueDelete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarHeistItem) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarHeistItem or not.
	 */
	function isHeistItem(obj: any): obj is BazaarHeistItem {
		return (
			obj &&
			'type' in obj &&
			getKeys(HEIST_TYPE).includes(obj.type) &&
			'tier' in obj &&
			getKeys(HEIST_TIER).includes(obj.tier) &&
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
		isHeistItem,
		queueSet,
		queueDelete,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useHeistOfferStore, import.meta.hot))
}
