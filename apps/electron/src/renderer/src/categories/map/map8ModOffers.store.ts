/**
 * Handle all 8 mod map offers through this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyBazaarOfferDto, BulkyFilter } from '@shared/types/bulky.types'
import { BazaarMap8Mod, BazaarMap8ModOffer } from './map.types'
import { MAP_TIER, MAP_TYPE } from './map.const'
import { BULKY_MAPS } from './map.transformers'
import { BULKY_REGEX } from '@web/utility/regex'
import { UserError } from '@shared/errors/userError'
import { useApi } from '@web/api/useApi'
import { notEmpty } from '@web/utility/notEmpty'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'

export const useMap8ModOfferStore = defineStore('Map8ModOfferStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const offers = ref<Map<BazaarMap8ModOffer['uuid'], BazaarMap8ModOffer>>(new Map())
	const fetchRequest = useApi('fetch8modMaps', nodeApi.getOffers)
	const lastFetched = ref(0)

	/**
	 * Consume an map listing dto, type and validate it and add it to the listings.
	 */
	function putOffer(dto: BulkyBazaarOfferDto) {
		const category = BULKY_CATEGORIES.generateCategoryFromDto(dto.category)
		if (category !== 'MAP_8_MOD') return

		const uuid = BULKY_UUID.generateTypedUuid<BazaarMap8ModOffer>(dto.uuid)
		const ign = dto.ign
		const league = dto.league
		const chaosPerDiv = dto.chaosPerDiv
		const minimumBuyout = dto.minimumBuyout ?? 0
		const items = dto.items.map(item => BULKY_MAPS.generateBazaarMap8ModItemFromDto(item)).filter(notEmpty)
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
			multiplier: 1,
			fullPrice: 0,
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

	/**
	 * Fetch all new map offers since the last fetch action.
	 * Use a timestamp as a limiter for the API.
	 */
	async function refetchOffers() {
		const refetchInterval = parseInt(import.meta.env.VITE_REFETCH_INTERVAL_OFFERS ?? '15000')

		if (Date.now() - lastFetched.value < refetchInterval) return
		if (fetchRequest.statusPending.value) return

		await fetchRequest.exec('MAP_8_MOD', configStore.config.league, lastFetched.value)

		// If the request threw an error or no data was obtained, just return.
		if (fetchRequest.error.value || !fetchRequest.data.value) return

		lastFetched.value = Date.now()
		fetchRequest.data.value.forEach(offerDto => putOffer(offerDto))
	}

	return {
		offers,
		lastFetched,
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
