import { BulkyBazaarOffer, BulkyFilter } from '@shared/types/bulky.types'
import { MAP_MODIFIERS } from '@web/categories/map/map.const'
import { BULKY_REGEX } from '@web/utility/regex'
import { computed } from 'vue'

export function useFilterOfferWithRegex(offer: BulkyBazaarOffer, filter: BulkyFilter) {
	return computed(() => {
		if (!filter.regex) {
			return offer.items
		}

		return offer.items
			.map(item => {
				// If there is a regex but there aren't any perItemAttributes, filter out the item.
				if (!item.perItemAttributes || !filter.regex) return false

				// Compute the provided regexes.
				const regexes = BULKY_REGEX.computeRegexesFromString(filter.regex)

				// If there are no regexes, return the item.
				if (regexes.length === 0) {
					return item
				}

				// Assign the computed regexes to predefined categories.
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
					.filter(Boolean)
				const addRegexes = regexes.filter(
					regex =>
						!(
							quantityRegexes.includes(regex) ||
							packSizeRegexes.includes(regex) ||
							rarityRegexes.includes(regex) ||
							regex.toString().startsWith('/!')
						)
				)

				// Check if the item supports the supplied regexes
				if (
					(quantityRegexes.length > 0 && !item.regex?.quantityRegex) ||
					(packSizeRegexes.length > 0 && !item.regex?.packsizeRegex) ||
					(avoidRegexes.length > 0 && !item.regex?.avoidRegex) ||
					(addRegexes.length > 0 && !item.regex?.wantedRegex)
				) {
					return false
				}

				// The offer item is an item stack, not the actual item.
				// Check the perItemAttributes to get individual items.
				// Return the quantity of all individual items that matched the regex.
				const count = item.perItemAttributes?.reduce((prev, curr) => {
					// Get the modifiers as a string array.
					const modifiers = curr.modifiers?.map(mod => MAP_MODIFIERS[mod])
					if (!modifiers) return prev

					// If any modifier matches the avoid regex, filter this individual item out.
					if (avoidRegexes.length > 0) {
						for (const avoidRegex of avoidRegexes) {
							for (const modifier of modifiers) {
								if (modifier.match(avoidRegex)) return prev
							}
						}
					}

					// If not all wanted regexes are matched by the modifiers, filter this individual item out.
					if (addRegexes.length > 0) {
						for (const addRegex of addRegexes) {
							let matched = false
							for (const modifier of modifiers) {
								if (modifier.match(addRegex)) {
									matched = true
									break
								}
							}
							if (!matched) return prev
						}
					}

					// If the item's quantity is lower than the regex quantity, filter this individual item out.
					if (quantityRegexes.length > 0 && curr.properties?.itemQuantity) {
						if (!`item quantity: ${curr.properties.itemQuantity}%`.match(quantityRegexes[0])) {
							return prev
						}
					}

					// If the item's pack size is lower than the regex pack size, filter this individual item out.
					if (packSizeRegexes.length > 0 && curr.properties?.packSize) {
						if (!`pack size: ${curr.properties.packSize}%`.match(packSizeRegexes[0])) {
							return prev
						}
					}
					return (prev += 1)
				}, 0)

				item.computedQuantity = count

				if (count > 0) {
					return item
				}

				return false
			})
			.filter(Boolean)
	})
}
