/**
 * Handle all fragment offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { notEmpty } from '@web/utility/notEmpty'
import { BazaarFragment, BazaarFragmentOffer } from './fragment.types'
import { FRAGMENT_SET, FRAGMENT_TYPE } from './fragment.const'

export const useFragmentOfferStore = defineStore('fragmentOfferStore', () => {
	const offers = ref<Map<BazaarFragmentOffer['uuid'], BazaarFragmentOffer>>(new Map())

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

	async function getTestData() {
		console.log('getting fragment test data')
		// if (listings.value.size !== 0) return

		const request = useApi('fragmentPayload', getListing)
		await request.exec('src/mocks/offersFragment.json')

		if (request.error.value || !request.data.value) {
			console.log('no way jose')
			return
		}

		request.data.value.forEach(listingDto => putOffer(listingDto))
	}

	/**
	 * Fetch all new fragment offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		console.log('Refetch fragment offers')
	}

	return {
		offers,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isFragment,
		refetchOffers,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFragmentOfferStore, import.meta.hot))
}
