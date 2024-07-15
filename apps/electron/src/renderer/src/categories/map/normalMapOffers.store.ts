/**
 * Handle all essence offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BazaarMap, BazaarMapOffer } from './map.types'
import { MAP_TIER, MAP_TYPE } from './map.const'
import { BULKY_FACTORY } from '@web/utility/factory'

export const useNormalMapOfferStore = defineStore('normalMapOfferStore', () => {
	const offers = ref<Map<BazaarMapOffer['uuid'], BazaarMapOffer>>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMapOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice ?? 5400
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items.map(item => BULKY_FACTORY.generateBazaarItemFromDto('MAP', item) as BazaarMap).filter(Boolean)
		if (!items) return

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
	 * Validate if an object is a BazaarEssence or not.
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

	async function getTestData() {
		// if (listings.value.size !== 0) return

		const request = useApi('essencePayload', getListing)
		await request.exec('src/mocks/essenceCompressed.json')

		if (request.error.value || !request.data.value) {
			console.log('no way jose')
			return
		}

		request.data.value.forEach(listingDto => putOffer(listingDto))
	}

	/**
	 * Fetch all new essence offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		console.log('Refetch map offers')
	}

	return {
		offers,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isNormalMap,
		refetchOffers,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNormalMapOfferStore, import.meta.hot))
}
