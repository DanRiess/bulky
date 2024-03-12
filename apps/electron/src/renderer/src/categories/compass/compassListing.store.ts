/** handle all compass listings through this store */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { Compass, CompassListing, CompassListings } from './compass.types'
import { Ref, ref } from 'vue'
import { Uuid } from '@web/types/utitlity.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BULKY_LEAGUES } from '@web/utility/league'
import { BULKY_SEXTANTS } from './compass.static'
import { GenericListingDto } from '@web/types/dto.types'
import { conformListingItems } from '@web/utility/conformers'
import { useApi } from '@web/api/useApi'
import { getListing } from '@web/api/bulkyApi'

export const useCompassListingStore = defineStore('compassListingStore', () => {
	const listings: Ref<CompassListings> = ref(new Map())

	/**
	 * Consume a compass listing dto, type and validate it and add it to the listings
	 */
	function addOrModifyListing(dto: GenericListingDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'COMPASS') return

		const uuid = BULKY_UUID.generateTypedUuid<CompassListing>(dto.uuid)
		const ign = dto.ign
		const league = BULKY_LEAGUES.generateLeagueFromDto(dto.league)
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = conformListingItems(
			dto.items,
			BULKY_SEXTANTS.generateSextantModifierFromDto,
			BULKY_SEXTANTS.generateCompassItemFromDto
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
	function deleteListing(uuid: Uuid<CompassListing>) {
		listings.value.delete(uuid)
	}

	/** validate if an object is a compass or not */
	function isCompass(obj: any): obj is Compass {
		return (
			obj &&
			'uses' in obj &&
			(obj.uses === 4 || obj.uses === 16) &&
			'quantity' in obj &&
			typeof obj.quantity === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	async function getTestData() {
		// if (listings.value.size !== 0) return

		const request = useApi('compassListing', getListing)
		await request.exec({ url: 'http://localhost:5173/src/mocks/compass.json' })

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
		isCompass,
		getTestData,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCompassListingStore, import.meta.hot))
}
