import { BulkyBazaarItem, BulkyBazaarOffer, BulkyFilter, BulkyFilterField, BulkyRegexes } from '@shared/types/bulky.types'
import { deepToRaw } from './deepToRaw'
import { BULKY_REGEX } from './regex'
import { FragmentType } from '@web/categories/fragment/fragment.types'
import { FRAGMENT_SET } from '@web/categories/fragment/fragment.const'
import { applyRegexToBulkyItem } from './applyRegexToBulkyItem'

export function filterOffer(
	offer: BulkyBazaarOffer,
	filter: BulkyFilter,
	regexes: BulkyRegexes,
	calculateBaseItemPrice: (item: BulkyBazaarItem, filter: BulkyFilter) => number
): BulkyBazaarOffer | null {
	// Filter out offers whose multipliers are too high.
	// The maximum possible multiplier (2) should display all offers though.
	// An offer can have a higher multiplier than 2 if some of its items were overridden with higher prices.
	if (filter.multiplier && filter.multiplier < 2 && filter.multiplier < offer.multiplier) return null

	// Filter the offer out if it is a fullBuyoutOnly offer and the filter didn't set the flag.
	if (offer.fullBuyout && !filter.fullBuyout) return null

	// If the user wants to buyout the full offer, don't filter.
	if (filter.fullBuyout) {
		return offer
	}

	// Clone the offer, so that not every change triggers an update.
	// Not sure if this is still necessary, but it only takes about 0.03ms.
	const offerClone = deepToRaw(offer)

	// Since we have to loop over the filter fields anyway, calculate their price.
	let price = 0

	// If an offer does not contain the necessary items, set this variable to true and return.
	let itemsMissingInOffer = false

	// Remove duplicate filter fields
	const seen = {} as Record<string, boolean>
	const computedFilterFields = filter.fields.filter(field => {
		const name = `${field.type}-${field.tier}`
		return seen.hasOwnProperty(name) ? false : (seen[name] = true)
	})

	// Filter out offers that have a higher 'minimumBuyout' than what the filter provides.
	for (let i = 0; i < computedFilterFields.length; ++i) {
		const field = computedFilterFields[i]

		// Only for fragment sets, use this calculation.
		if (filter.category === 'FRAGMENT' && filter.fullSets) {
			const fragmentResult = filterFragmentSetOffer(filter, field, offer)
			itemsMissingInOffer = fragmentResult.itemsMissingInOffer
			price += fragmentResult.price
			continue
		}

		// This loop can potentially trigger a change on each item in each offer.
		// When that happens, everything basically freezes.

		// For all items, use this calculation instead.
		const item = offerClone.items.find(item => item.type === field.type && item.tier === field.tier)
		if (item) {
			// Apply the regex to this item, if it is available
			// This will change the item's computedQuantity property and potentially filter it out in the next step.
			if (BULKY_REGEX.regexAmount(regexes) > 0) {
				item.computedQuantity = applyRegexToBulkyItem(item, regexes)
			} else {
				item.computedQuantity = item.quantity
			}

			// Filter out the offer if the requested quantity is larger than the available stock.
			if (field.quantity > item.computedQuantity) {
				itemsMissingInOffer = true
				break
			}

			// Try to calculate the price. If it fails (should only happen with regex offers), filter out the offer.
			try {
				const basePrice = calculateBaseItemPrice(item, filter)
				price += filter.alwaysMaxQuantity ? basePrice * item.quantity : basePrice * field.quantity
			} catch (e) {
				itemsMissingInOffer = true
			}
		} else {
			itemsMissingInOffer = true
			break
		}
	}

	// If at least one item does not exist in the offer, return.
	if (itemsMissingInOffer) return null

	// If the calculated price is smaller than the minimum buyout, return.
	// TODO: Check this, it might be better to display it buy grey it out.
	// if (price < offer.minimumBuyout) return

	// If all checks have passed, add the offer to the map.
	return offerClone
}

function filterFragmentSetOffer(filter: BulkyFilter, filterField: BulkyFilterField, offer: BulkyBazaarOffer) {
	const necessaryItems: FragmentType[] | undefined = FRAGMENT_SET[filterField.type]
	if (!necessaryItems) {
		return {
			itemsMissingInOffer: false,
			price: 0,
		}
	}

	let setPrice = 0
	let maxQuantityIfAlwaysMaxQuantity = Infinity

	const allItemsAvailable = necessaryItems.every(necessaryItem => {
		const itemInOffer = offer.items.find(item => item.type === necessaryItem)

		if (!itemInOffer) return false

		// If alwaysMaxQuantity is selected, set the maxQuantity value to the itemInOffer's quantity if it's smaller.
		if (filter.alwaysMaxQuantity) {
			maxQuantityIfAlwaysMaxQuantity = Math.min(maxQuantityIfAlwaysMaxQuantity, itemInOffer.quantity)
		} else {
			// If the available item quantity is lower than what the filter wants, reject the offer.
			if (itemInOffer.quantity < filterField.quantity) return false
		}

		setPrice += itemInOffer.price

		return true
	})

	const price = filter.alwaysMaxQuantity ? setPrice * maxQuantityIfAlwaysMaxQuantity : setPrice * filterField.quantity

	return {
		itemsMissingInOffer: !allItemsAvailable,
		price: allItemsAvailable ? price : 0,
	}
}
