/**
 * Handle all 8 mod map offers through this store.
 */

import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { MAP_TIER, MAP_TYPE } from './map.const'
import { BULKY_MAPS } from './map.transformers'
import { UserError } from '@shared/errors/userError'

import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_REGEX } from '@web/utility/regex'
import { BULKY_UUID } from '@web/utility/uuid'
import { notEmpty } from '@web/utility/notEmpty'

import { BazaarMap8Mod, BazaarMap8ModOffer } from './map.types'
import { BulkyBazaarOfferDto, BulkyFilter } from '@shared/types/bulky.types'
import { OfferRequestTimestamps } from '@shared/types/api.types'
import { getKeys } from '@shared/types/utility.types'
import { useDebouncedReactiveMap } from '@web/composables/useDebouncedOfferStore'

export const useMap8ModOfferStore = defineStore('Map8ModOfferStore', () => {
	// STATE
	// const offers = ref<Map<BazaarMap8ModOffer['uuid'], BazaarMap8ModOffer>>(new Map())
	const { _offers, offers, queueSet, queueDelete } = useDebouncedReactiveMap<BazaarMap8ModOffer['uuid'], BazaarMap8ModOffer>({
		id: 'map8modoffers',
	})
	const requestTimestamps = ref<OfferRequestTimestamps>({})

	/**
	 * Consume an map listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP_8_MOD') return

		// Don't process the offer if it's older than 10 minutes.
		if (Date.now() > dto.timestamp + Number(import.meta.env.VITE_OFFER_TTL)) return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMap8ModOffer>(dto.uuid)
		const account = dto.account
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const minimumBuyout = dto.minimumBuyout ?? 0
		const timestamp = dto.timestamp
		const items = dto.items.map(item => BULKY_MAPS.generateBazaarMap8ModItemFromDto(item)).filter(notEmpty)
		if (!items) return

		// Delete previous offers if they are from the same account.
		for (const offer of offers.value.values()) {
			if (offer.account === account && offer.league === league) {
				// offers.value.delete(offer.uuid)
				queueDelete(offer.uuid)
			}
		}

		const newOffer = {
			category,
			account,
			uuid,
			ign,
			league,
			timestamp,
			chaosPerDiv,
			items,
			minimumBuyout,
			contact: {
				messageSent: false,
				timestamp: 0,
			},
			multiplier: 1,
			fullPrice: 0,
		}

		queueSet(uuid, newOffer)
	}

	/**
	 * Delete an offer. Will be called if it's expired.
	 */
	function deleteOffer(uuid: BazaarMap8ModOffer['uuid']) {
		// offers.value.delete(uuid)
		queueDelete(uuid)
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
			return item.price
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

		let price = item.price

		// Use the first found quantity regex and check if it matches any of the items provided quantity values.
		if (quantityRegexes.length > 0) {
			// Sort the item's quant prices by quantity
			const sortedItemQuantPricing = item.regex.quantityRegex?.toSorted((a, b) => a[0] - b[0])

			// Will be set to true if user provided quant regex matches any of the quantities the item offers.
			let quantRegexMatches = false

			// Test the user provided quant regex against the quantities the item offers.
			if (sortedItemQuantPricing) {
				for (const quantPricing of sortedItemQuantPricing) {
					// Create a string that uses the quantPricings quantity.
					const str = `m q:${quantPricing[0]}%`

					// Test that string against the FIRST user provided regex. Skip the others.
					const match = str.match(quantityRegexes[0])

					// Add the price in case of a match and break the loop
					if (match) {
						price += quantPricing[1]
						quantRegexMatches = true
						break
					}
				}
			}

			// If the user provided regex didn't match any of the offered quantities, throw an error.
			if (!quantRegexMatches) {
				throw new UserError({
					code: 'regex_unsupported',
					message: `This item does not support your provided quantity regex.`,
				})
			}
		}

		// Use the first found quantity regex and check if it matches any of the items provided quantity values.
		if (packSizeRegexes.length > 0) {
			// Sort the item's quant prices by quantity
			const sortedItemPacksizePricing = item.regex.packsizeRegex?.toSorted((a, b) => a[0] - b[0])

			// Will be set to true if user provided quant regex matches any of the quantities the item offers.
			let packsizeRegexMatches = false

			// Test the user provided quant regex against the quantities the item offers.
			if (sortedItemPacksizePricing) {
				for (const packsizePricing of sortedItemPacksizePricing) {
					// Create a string that uses the packsizePricings packsize.
					const str = `size:${packsizePricing[0]}%`

					// Test that string against the FIRST user provided regex. Skip the others.
					const match = str.match(packSizeRegexes[0])

					// Add the price in case of a match and break the loop
					if (match) {
						price += packsizePricing[1]
						packsizeRegexMatches = true
						break
					}
				}
			}

			// If the user provided regex didn't match any of the offered quantities, throw an error.
			if (!packsizeRegexMatches) {
				console.log('here?')
				throw new UserError({
					code: 'regex_unsupported',
					message: 'This item does not support your provided pack size regex.',
				})
			}
		}

		// Check if the regex has modifiers to avoid
		if (avoidRegexes.length > 0) {
			if (!item.regex.avoidRegex) {
				throw new UserError({
					code: 'regex_unsupported',
					message: 'This item does not support regexes with modifiers to avoid.',
				})
			}

			price += item.regex.avoidRegex
		}

		// Check if the regex has modifiers the user wants
		if (addRegexes.length > 0) {
			if (!item.regex.wantedRegex) {
				throw new UserError({
					code: 'regex_unsupported',
					message: 'This item does not support regexes with wanted modifiers.',
				})
			}

			price += item.regex.wantedRegex
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
			typeof obj.price === 'number'
		)
	}

	return {
		_offers,
		offers,
		requestTimestamps,
		putOffer,
		deleteOffer,
		calculateBaseItemPrice,
		isMap8Mod,
		queueSet,
		queueDelete,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMap8ModOfferStore, import.meta.hot))
}
