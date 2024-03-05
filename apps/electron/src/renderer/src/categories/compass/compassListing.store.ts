/** handle all compass listings through this store */

import { defineStore } from 'pinia'
import { Compass, CompassListing, CompassListingDto, CompassListings } from './compass.types'
import { ref } from 'vue'
import { Uuid } from '@web/types/utitlity.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BULKY_LEAGUES } from '@web/utility/league'
import { conformPayloadKeys, validatePayloadValues } from '@web/utility/conformers'
import { BULKY_SEXTANTS } from '@web/utility/sextant'

export const useCompassListingStore = defineStore('compassListingStore', () => {
	const listings = ref<CompassListings>(new Map())

	/**
	 * Consume a compass listing dto, type and validate it and add it to the listings
	 */
	function addOrModifyListing(dto: CompassListingDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'COMPASS') return

		const uuid = BULKY_UUID.generateTypedUuid<CompassListing>(dto.uuid)
		const ign = dto.ign
		const league = BULKY_LEAGUES.generateLeagueFromDto(dto.league)
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout ?? 0
		const payload = validatePayloadValues<CompassListing['payload']>(
			conformPayloadKeys(dto.payload, BULKY_SEXTANTS.generateSextantModifierFromDto),
			isCompass
		)

		listings.value.set(uuid, {
			uuid,
			ign,
			league,
			chaosPerDiv,
			multiplier,
			payload,
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
			'amount' in obj &&
			typeof obj.amount === 'number' &&
			'price' in obj &&
			typeof obj.price === 'number'
		)
	}

	return {
		listings,
		addOrModifyListing,
		deleteListing,
		isCompass,
	}
})
