/** handle all essence listings through this store */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { Uuid, getKeys } from '@web/types/utitlity.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BULKY_LEAGUES } from '@web/utility/league'
import { Essence, EssenceListing, EssenceListings } from './essence.types'
import { BULKY_ESSENCES } from './essence.static'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'
import { GenericListingDto } from '@web/types/dto.types'
import { ESSENCE_TIER } from './essence.const'
import { conformListingItems } from '@web/utility/conformers'

export const useEssenceListingStore = defineStore('essenceListingStore', () => {
	const listings = ref<EssenceListings>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings
	 */
	function addOrModifyListing(dto: GenericListingDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'ESSENCE') return

		const uuid = BULKY_UUID.generateTypedUuid<EssenceListing>(dto.uuid)
		const ign = dto.ign
		const league = BULKY_LEAGUES.generateLeagueFromDto(dto.league)
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = conformListingItems<Essence>(
			dto.items,
			BULKY_ESSENCES.generateEssenceTypeFromDto,
			BULKY_ESSENCES.conformEssenceFromDto
		)

		listings.value.set(uuid, {
			uuid,
			ign,
			league,
			chaosPerDiv,
			multiplier,
			items,
			minimumBuyout,
			messageSent: false,
		})
	}

	/** delete listing */
	function deleteListing(uuid: Uuid<EssenceListing>) {
		listings.value.delete(uuid)
	}

	/** validate if an object is a BulkyEssence or not */
	function isEssence(obj: any): obj is Essence {
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
		await request.exec({ url: 'http://localhost:5173/src/mocks/essence.json' })

		if (request.error.value || !request.data.value) {
			console.log('no way jose')
			return
		}

		request.data.value.forEach(listingDto => addOrModifyListing(listingDto))
	}

	return {
		listings,
		addOrModifyListing,
		deleteListing,
		isEssence,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEssenceListingStore, import.meta.hot))
}
