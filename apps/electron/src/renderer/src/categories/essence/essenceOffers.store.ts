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
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'
import { BulkyBazaarOfferDto } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'

export const useEssenceOfferStore = defineStore('essenceOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarEssenceOffer['uuid'], BazaarEssenceOffer>>(new Map())
	const fetchRequest = useApi('fetchEssences', nodeApi.getOffers)
	const lastFetched = ref(0)

	// METHODS

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'ESSENCE') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarEssenceOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const fullPrice = dto.fullPrice
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items
			.map(item => BULKY_FACTORY.generateBazaarItemFromDto('ESSENCE', item) as BazaarEssence)
			.filter(Boolean)
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
	function deleteOffer(uuid: BazaarEssenceOffer['uuid']) {
		offers.value.delete(uuid)
	}

	/**
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 */
	function calculateBaseItemPrice(item: BazaarEssence) {
		return item.price
	}

	/**
	 * Validate if an object is a BazaarEssence or not.
	 */
	function isEssence(obj: any): obj is BazaarEssence {
		return (
			obj &&
			'type' in obj &&
			getKeys(ESSENCE_TYPE).includes(obj.type) &&
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
		await request.exec('src/mocks/offersEssence.json')

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
		const refetchInterval = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

		if (Date.now() - lastFetched.value < refetchInterval) return
		if (fetchRequest.statusPending.value) return

		await fetchRequest.exec('ESSENCE', configStore.config.league, lastFetched.value)

		// If the request threw an error or no data was obtained, just return.
		if (fetchRequest.error.value || !fetchRequest.data.value) return

		lastFetched.value = Date.now()
		fetchRequest.data.value.forEach(offerDto => putOffer(offerDto))
	}

	return {
		offers,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isEssence,
		refetchOffers,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEssenceOfferStore, import.meta.hot))
}
