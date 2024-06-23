/**
 * Handle all essence offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BazaarEssence, BazaarEssenceOffer } from './essence.types'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { ESSENCE_TIER, ESSENCE_TIER_IDX_TO_NAME, ESSENCE_TYPE_IDX_TO_NAME } from './essence.const'
import { conformBinaryListingItems } from '@web/utility/conformers'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BULKY_ESSENCES } from './essence.static'

export const useEssenceOfferStore = defineStore('essenceListingStore', () => {
	const offers = ref<Map<BazaarEssenceOffer['uuid'], BazaarEssenceOffer>>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'ESSENCE') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarEssenceOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice ?? 5400
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = conformBinaryListingItems<BazaarEssence>(
			dto.items,
			BULKY_ESSENCES.generateEssenceNameFromTypeAndTier,
			ESSENCE_TYPE_IDX_TO_NAME,
			ESSENCE_TIER_IDX_TO_NAME
		)
		if (!items) return

		offers.value.set(uuid, {
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

	/** delete listing */
	function deleteListing(uuid: BazaarEssenceOffer['uuid']) {
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

		request.data.value.forEach(listingDto => putOffer(listingDto))
	}

	/**
	 * Fetch all new essence offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		console.log('Refetch essence offers')
	}

	return {
		offers,
		putOffer,
		deleteListing,
		isEssence,
		refetchOffers,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEssenceOfferStore, import.meta.hot))
}
