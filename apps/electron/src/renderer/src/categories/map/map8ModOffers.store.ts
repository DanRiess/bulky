/**
 * Handle all essence offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyBazaarMap8ModOfferDto } from '@shared/types/bulky.types'
import { BazaarMap8Mod, BazaarMap8ModOffer } from './map.types'
import { MAP_TIER, MAP_TYPE } from './map.const'
import { BULKY_MAPS } from './map.transformers'

export const useMap8ModOfferStore = defineStore('Map8ModOfferStore', () => {
	const offers = ref<Map<BazaarMap8ModOffer['uuid'], BazaarMap8ModOffer>>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarMap8ModOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP_8_MOD') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMap8ModOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items.map(item => BULKY_MAPS.generateBazaarMap8ModItemFromDto(item)).filter(Boolean)
		if (!items) return

		offers.value.set(uuid, {
			category,
			uuid,
			ign,
			league,
			chaosPerDiv,
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
	function deleteOffer(uuid: BazaarMap8ModOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Validate if an object is a BazaarEssence or not.
	 */
	function isMap8Mod(obj: any): obj is BazaarMap8Mod {
		return (
			obj &&
			'type' in obj &&
			getKeys(MAP_TYPE).includes(obj.type) &&
			'tier' in obj &&
			getKeys(MAP_TIER).includes(obj.tier) &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			'base' in obj.price &&
			typeof obj.price.base === 'number'
		)
	}

	// async function getTestData() {
	// 	// if (listings.value.size !== 0) return

	// 	const request = useApi('essencePayload', getListing)
	// 	await request.exec('src/mocks/essenceCompressed.json')

	// 	if (request.error.value || !request.data.value) {
	// 		console.log('no way jose')
	// 		return
	// 	}

	// 	request.data.value.forEach(listingDto => putOffer(listingDto))
	// }

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
		isMap8Mod,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMap8ModOfferStore, import.meta.hot))
}
