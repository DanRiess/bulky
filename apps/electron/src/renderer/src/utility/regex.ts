import { RendererError } from '@shared/errors/rendererError'
import { BulkyBazaarItem } from '@shared/types/bulky.types'
import { findIndicesInString } from './stringManipulation'

export const BULKY_REGEX = {
	computeRegexesFromString,
	calculateMapPriceFromRegex,
}

/**
 * Analyze the provided regex subparts and appoint them to predefined categories.
 * Check if the offer provides support for all subparts of the regex.
 *
 * As an example, if a user enters a regex with quantity, but the seller has not set
 * a price for quantity, this function will throw an error.
 *
 * @throws {RendererError} The regex has to be valid and supported by the offer.
 */
function calculateMapPriceFromRegex(item: BulkyBazaarItem, regexes: RegExp[]) {
	if (item.priceMap8Mod) {
		if (regexes.length === 0) {
			return item.priceMap8Mod.base
		}

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

		// Check if the regex matches 120+ / 110+ quantity.
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
	} else if (item.price) {
		return item.price
	}

	return 0
}

/**
 * This function splits a raw regex string into the regexes that should be used.
 * The raw regex string will be split at space characters.
 * Exception: substrings in quotation marks ("") count as one part.
 * Each obtained part is its own regex and will be returned.
 */
function computeRegexesFromString(rawRegex: string) {
	const regexStringArray: string[] = []

	// Extract all quoted substrings from the raw regex
	// Find all quotation mark indices
	const indices = findIndicesInString('"', rawRegex).reverse()
	if (indices.length % 2 !== 0) return []

	// Indices are listed from highest to lowest
	for (let i = 0; i < indices.length; i += 2) {
		const start = indices[i + 1]
		const end = indices[i]
		const regexString = rawRegex.substring(start + 1, end)
		regexStringArray.push(regexString)

		// Slice out that part of the string
		rawRegex = rawRegex.substring(0, start) + rawRegex.substring(end + 1)
		rawRegex = rawRegex.trim()
	}

	const remainingParts = rawRegex.split(' ').filter(Boolean)
	regexStringArray.push(...remainingParts)

	return regexStringArray.map(r => new RegExp(r, 'gmi'))
}
