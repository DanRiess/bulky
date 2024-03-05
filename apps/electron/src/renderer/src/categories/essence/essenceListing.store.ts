/** handle all essence listings through this store */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Uuid, getKeys } from '@web/types/utitlity.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BULKY_LEAGUES } from '@web/utility/league'
import { conformPayloadKeys, validatePayloadValues } from '@web/utility/conformers'
import { BULKY_SEXTANTS } from '@web/utility/sextant'
import { Essence, EssenceListing, EssenceListingDto, EssenceListings } from './essence.types'
import { ESSENCE_TIER } from './essence.const'

export const useEssenceListingStore = defineStore('essenceListingStore', () => {
	const listings = ref<EssenceListings>(new Map())

	/**
	 * Consume an essence listing dto, type and validate it and add it to the listings
	 */
	function addOrModifyListing(dto: EssenceListingDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'COMPASS') return

		const uuid = BULKY_UUID.generateTypedUuid<EssenceListing>(dto.uuid)
		const ign = dto.ign
		const league = BULKY_LEAGUES.generateLeagueFromDto(dto.league)
		const chaosPerDiv = dto.chaosPerDiv
		const multiplier = dto.multiplier
		const minimumBuyout = dto.minimumBuyout ?? 0
		const payload = validatePayloadValues<EssenceListing['payload']>(
			conformPayloadKeys(dto.payload, BULKY_SEXTANTS.generateSextantModifierFromDto),
			isEssence
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
	function deleteListing(uuid: Uuid<EssenceListing>) {
		listings.value.delete(uuid)
	}

	/** validate if an object is a compass or not */
	function isEssence(obj: any): obj is Essence {
		return (
			obj &&
			'tier' in obj &&
			getKeys(ESSENCE_TIER).includes(obj.tier) &&
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
		isEssence,
	}
})
