/**
 * Handle all catalyst offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { CATALYST_TYPE } from './catalyst.const'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { BazaarCatalyst, BazaarCatalystOffer } from './catalyst.types'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import { useDebouncedReactiveMap } from '@web/composables/useDebouncedOfferStore'

export const useCatalystOfferStore = defineStore('catalystOfferStore', () => {
	// STATE
	// const offers = ref<Map<BazaarCatalystOffer['uuid'], BazaarCatalystOffer>>(new Map())
	const { _offers, offers, queueSet, queueDelete } = useDebouncedReactiveMap<BazaarCatalystOffer['uuid'], BazaarCatalystOffer>()
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume a catalyst listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'CATALYST') return

		// Don't process the offer if it's older than 10 minutes.
		if (Date.now() > dto.timestamp + Number(import.meta.env.VITE_OFFER_TTL)) return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarCatalystOffer>(dto.uuid)
		const account = dto.account
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const timestamp = dto.timestamp
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('CATALYST', item) as BazaarCatalyst)
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
			items,
			minimumBuyout,
			multiplier,
			fullPrice,
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
	function deleteOffer(uuid: BazaarCatalystOffer['uuid']) {
		// offers.value.delete(uuid)
		queueDelete(uuid)
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

	return {
		_offers,
		offers,
		requestTimestamps,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isCatalyst,
		queueSet,
		queueDelete,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCatalystOfferStore, import.meta.hot))
}
