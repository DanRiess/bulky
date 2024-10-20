import { BulkyBazaarOffer, BulkyFilter, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { applyRegexToBulkyItem } from '@web/utility/applyRegexToBulkyItem'
import { BULKY_REGEX } from '@web/utility/regex'
import { computed, MaybeRefOrGetter, toValue } from 'vue'

export function useApplyFilterToOffers(
	maybeRefStore: MaybeRefOrGetter<ComputedBulkyOfferStore>,
	maybeRefFilter: MaybeRefOrGetter<BulkyFilter>
) {
	return computed<Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer>>(() => {
		const offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer> = new Map()
		const store = toValue(maybeRefStore)
		const filter = toValue(maybeRefFilter)

		// Compute and categorize the regexes.
		const regexArray = filter.regex ? BULKY_REGEX.computeRegexesFromString(filter.regex) : []
		const regexes = BULKY_REGEX.categorizeRegexes(regexArray)

		store.offers.forEach((offer: BulkyBazaarOffer) => {
			// Filter out all offers whose multipliers are too high.
			// The maximum possible multiplier (2) should display all offers though.
			// An offer can have a higher multiplier than 2 if some of its items were overridden with higher prices.
			if (filter.multiplier && filter.multiplier < 2 && filter.multiplier < offer.multiplier) return

			// If the user wants to buyout the full offer, return the offer.
			if (filter.fullBuyout) {
				offers.set(offer.uuid, offer)
				return
			}

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
				const item = offer.items.find(item => item.type === field.type && item.tier === field.tier)
				if (item) {
					// Apply the regex to this item, if it is available
					// This will change the item's computedQuantity property and potentially filter it out in the next step.
					if (regexArray.length > 0) {
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
						const basePrice = store.calculateBaseItemPrice(item, filter)
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
			if (itemsMissingInOffer) return

			// If the calculated price is smaller than the minimum buyout, return.
			if (price < offer.minimumBuyout) return

			// If all checks have passed, add the offer to the map.
			offers.set(offer.uuid, offer)
		})

		return offers
	})
}
