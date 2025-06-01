import { BulkyRegexes } from '@shared/types/bulky.types'
import { findIndicesInString } from './stringManipulation'
import { notEmpty } from './notEmpty'

export const BULKY_REGEX = {
	computeRegexesFromString,
	categorizeRegexes,
	regexAmount,
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

function categorizeRegexes(regexes: RegExp[]): BulkyRegexes {
	const quantityRegexes = regexes.filter(regex => regex.toString().match(/m q.*/i))
	const packSizeRegexes = regexes.filter(regex => regex.toString().match(/iz.*([1-9]).*%/i))
	const rarityRegexes = regexes.filter(regex => regex.toString().match(/y: \([(n|m|r)]*\)/i))
	const avoidRegexes = regexes
		.map(regex => {
			const stringRegex = regex.toString()
			if (stringRegex.startsWith('/!')) {
				return new RegExp(stringRegex.replace('/!', '').replace('/gim', ''), 'gmi')
			}
			return undefined
		})
		.filter(notEmpty)
	const wantedRegexes = regexes.filter(
		regex =>
			!(
				quantityRegexes.includes(regex) ||
				packSizeRegexes.includes(regex) ||
				rarityRegexes.includes(regex) ||
				regex.toString().startsWith('/!')
			)
	)

	return {
		quantity: quantityRegexes,
		packSize: packSizeRegexes,
		rarity: rarityRegexes,
		avoid: avoidRegexes,
		wanted: wantedRegexes,
	}
}

function regexAmount(bulkyRegexes: BulkyRegexes) {
	return Object.values(bulkyRegexes).reduce((prev, curr) => {
		return (prev += curr.length)
	}, 0)
}
