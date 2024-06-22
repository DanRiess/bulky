/**
 * Handle all essence offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BazaarEssence } from './essence.types'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { ESSENCE_TIER, ESSENCE_TIER_IDX_TO_NAME, ESSENCE_TYPE_IDX_TO_NAME } from './essence.const'
import { conformBinaryListingItems } from '@web/utility/conformers'
import { BulkyBazaarOffer, BulkyBazaarOfferDto } from '@shared/types/bulky.types'

export const useEssenceOfferStore = defineStore('essenceListingStore', () => {
	const offers = ref<Map<BulkyBazaarOffer<BazaarEssence>['uuid'], BulkyBazaarOffer<BazaarEssence>>>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings
	 */
	function addOrModifyListing(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'ESSENCE') return

		const uuid = BULKY_UUID.generateTypedUuid<BulkyBazaarOffer<BazaarEssence>>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout
		const items = conformBinaryListingItems<BazaarEssence>(dto.items, ESSENCE_TYPE_IDX_TO_NAME, ESSENCE_TIER_IDX_TO_NAME)
		if (!items) return

		offers.value.set(uuid, {
			uuid,
			ign,
			league,
			chaosPerDiv,
			multiplier,
			items,
			minimumBuyout,
			contact: {
				messageSent: false,
				timestamp: 0,
			},
		})
	}

	/** delete listing */
	function deleteListing(uuid: BulkyBazaarOffer<BazaarEssence>['uuid']) {
		offers.value.delete(uuid)
	}

	/** validate if an object is a BulkyEssence or not */
	function isEssence(obj: any): obj is BazaarEssence {
		return (
			obj &&
			'tier' in obj &&
			getKeys(ESSENCE_TIER).includes(obj.tier) &&
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

		request.data.value.forEach(listingDto => addOrModifyListing(listingDto))
	}

	return {
		offers,
		addOrModifyListing,
		deleteListing,
		isEssence,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEssenceOfferStore, import.meta.hot))
}
