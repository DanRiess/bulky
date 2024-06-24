/**
 * Handle all scarab offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { conformBinaryListingItems } from '@web/utility/conformers'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BazaarScarab, BazaarScarabOffer } from './scarab.types'
import { BULKY_SCARABS } from './scarab.transformers'
import { SCARAB_TYPE, SCARAB_TYPE_IDX_TO_NAME } from './scarab.const'

export const useScarabOfferStore = defineStore('scarabOfferStore', () => {
	const offers = ref<Map<BazaarScarabOffer['uuid'], BazaarScarabOffer>>(new Map())

	/**
	 * Consume an scarab listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'SCARAB') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarScarabOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice ?? 5400
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = conformBinaryListingItems<BazaarScarab>(
			dto.items,
			'SCARAB',
			BULKY_SCARABS.generateScarabNameFromType,
			SCARAB_TYPE_IDX_TO_NAME,
			['0']
		)
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
	function deleteOffer(uuid: BazaarScarabOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Validate if an object is a BazaarScarab or not.
	 */
	function isScarab(obj: any): obj is BazaarScarab {
		return (
			obj &&
			'type' in obj &&
			getKeys(SCARAB_TYPE).includes(obj.type) &&
			'tier' in obj &&
			obj.tier === '0' &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	async function getTestData() {
		// if (listings.value.size !== 0) return

		const request = useApi('scarabPayload', getListing)
		await request.exec('src/mocks/scarabCompressed.json')

		if (request.error.value || !request.data.value) {
			console.log('no way jose')
			return
		}

		request.data.value.forEach(listingDto => putOffer(listingDto))
	}

	/**
	 * Fetch all new scarab offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		console.log('Refetch scarab offers')
	}

	return {
		offers,
		putOffer,
		deleteOffer,
		isScarab,
		refetchOffers,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useScarabOfferStore, import.meta.hot))
}
