/**
 * Handle all essence offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyBazaarMap8ModOfferDto, BulkyFilter } from '@shared/types/bulky.types'
import { BazaarMap8Mod, BazaarMap8ModOffer } from './map.types'
import { MAP_TIER, MAP_TYPE } from './map.const'
import { BULKY_MAPS } from './map.transformers'
import { RendererError } from '@shared/errors/rendererError'
import { BULKY_REGEX } from '@web/utility/regex'

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
	 * Prices are being calculated differently for some categories.
	 * This implementation enables generically calling store.calculateBaseItemPrice.
	 *
	 * @throws { RendererError } Will throw if the regex and the offer don't match for any reason.
	 */
	function calculateBaseItemPrice(item: BazaarMap8Mod, filter: BulkyFilter) {
		// Compute the provided regexes.
		const regexes = filter.regex ? BULKY_REGEX.computeRegexesFromString(filter.regex) : []

		// If no regex was provided, just return the base price.
		if (regexes.length === 0) {
			return item.priceMap8Mod.base
		}

		// Assign the computed regexes to predefined categories.
		const quantityRegexes = regexes.filter(regex => regex.toString().match(/m q.*/i))
		const packSizeRegexes = regexes.filter(regex => regex.toString().match(/iz.*([1-9]).*%/i))
		const rarityRegexes = regexes.filter(regex => regex.toString().match(/y: \([(n|m|r)]*\)/i))
		const avoidRegexes = regexes.filter(regex => regex.toString().startsWith('/!'))
		const addRegexes = regexes.filter(
			regex =>
				!(
					avoidRegexes.includes(regex) ||
					quantityRegexes.includes(regex) ||
					packSizeRegexes.includes(regex) ||
					rarityRegexes.includes(regex)
				)
		)

		let price = item.priceMap8Mod.base

		// Use the first found quantity regex and check if it matches 120+ / 110+ quantity.
		// If the offer has that respective price defined, add it.
		if (quantityRegexes.length > 1) {
			if ('m q:120%'.match(quantityRegexes[0]) && item.priceMap8Mod.quant120) {
				price += item.priceMap8Mod.quant120
			} else if ('m q:110%'.match(quantityRegexes[0]) && item.priceMap8Mod.quant110) {
				price += item.priceMap8Mod.quant110
			} else {
				throw new RendererError({
					code: 'regex_unsupported',
					message:
						'This item either does not support a quantity regex or your quantity value is to low (has to be at least 110%).',
				})
			}
		}

		// Check if the regex has modifiers to avoid
		if (avoidRegexes.length > 0) {
			if (!item.priceMap8Mod.avoidRegex) {
				throw new RendererError({
					code: 'regex_unsupported',
					message: 'This item does not support regexes with modifiers to avoid.',
				})
			}

			price += item.priceMap8Mod.avoidRegex
		}

		// Check if the regex has modifiers the user wants
		if (addRegexes.length > 0) {
			if (!item.priceMap8Mod.addRegex) {
				throw new RendererError({
					code: 'regex_unsupported',
					message: 'This item does not support regexes with wanted modifiers.',
				})
			}

			price += item.priceMap8Mod.addRegex
		}

		return price
	}

	/**
	 * Validate if an object is a BazaarMap8Mod or not.
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
		calculateBaseItemPrice,
		isMap8Mod,
		refetchOffers,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMap8ModOfferStore, import.meta.hot))
}
