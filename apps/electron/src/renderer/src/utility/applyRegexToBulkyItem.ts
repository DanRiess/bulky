import { BulkyBazaarItem, BulkyRegexes } from '@shared/types/bulky.types'
import { MAP_MODIFIERS } from '@web/categories/map/map.const'

/**
 * Apply regexes to a BulkyItem.
 * Use the return value as the item's computedQuantity property.
 *
 * @returns The amount of individual items that were matched by the regexes.
 */
export function applyRegexToBulkyItem(item: BulkyBazaarItem, regexes: BulkyRegexes): number {
	// If there is a regex but there aren't any perItemAttributes, filter out the item.
	if (!item.perItemAttributes) return 0

	// Check if the item supports the supplied regexes
	if (
		(regexes.quantity.length > 0 && !item.regex?.quantityRegex) ||
		(regexes.packSize.length > 0 && !item.regex?.packsizeRegex) ||
		(regexes.avoid.length > 0 && !item.regex?.avoidRegex) ||
		(regexes.wanted.length > 0 && !item.regex?.wantedRegex)
	) {
		return 0
	}

	// The offer item is an item stack, not the actual item.
	// Check the perItemAttributes to get individual items.
	// Return the quantity of all individual items that matched the regex.
	return item.perItemAttributes.reduce((prev, curr) => {
		// Get the modifiers as a string array.
		const modifiers = curr.modifiers?.map(mod => MAP_MODIFIERS[mod])
		if (!modifiers) return prev

		// If any modifier matches the avoid regex, filter this individual item out.
		if (regexes.avoid.length > 0) {
			for (const avoidRegex of regexes.avoid) {
				for (const modifier of modifiers) {
					if (modifier.match(avoidRegex)) return prev
				}
			}
		}

		// If not all wanted regexes are matched by the modifiers, filter this individual item out.
		if (regexes.wanted.length > 0) {
			for (const wantedRegex of regexes.wanted) {
				let matched = false
				for (const modifier of modifiers) {
					if (modifier.match(wantedRegex)) {
						matched = true
						break
					}
				}
				if (!matched) return prev
			}
		}

		// If the item's quantity is lower than the regex quantity, filter this individual item out.
		if (regexes.quantity.length > 0 && curr.properties?.itemQuantity) {
			if (!`item quantity: ${curr.properties.itemQuantity}%`.match(regexes.quantity[0])) {
				return prev
			}
		}

		// If the item's pack size is lower than the regex pack size, filter this individual item out.
		if (regexes.packSize.length > 0 && curr.properties?.packSize) {
			if (!`pack size: ${curr.properties.packSize}%`.match(regexes.packSize[0])) {
				return prev
			}
		}
		return (prev += 1)
	}, 0)
}
