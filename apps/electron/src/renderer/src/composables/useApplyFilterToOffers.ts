import { BulkyBazaarOffer, BulkyFilter, BulkyFilterField, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { refDebounced } from '@vueuse/core'
import { FRAGMENT_SET } from '@web/categories/fragment/fragment.const'
import { FragmentType } from '@web/categories/fragment/fragment.types'
import { applyRegexToBulkyItem } from '@web/utility/applyRegexToBulkyItem'
import { deepToRaw } from '@web/utility/deepToRaw'
import { BULKY_REGEX } from '@web/utility/regex'
import { computed, MaybeRefOrGetter, toValue } from 'vue'

/**
 * DEPRECATED: this utility is now in useFilterOffers and uses watchers for more fine grained calculations.
 */
export function useApplyFilterToOffers(
	maybeRefStore: MaybeRefOrGetter<ComputedBulkyOfferStore>,
	maybeRefFilter: MaybeRefOrGetter<BulkyFilter>
) {
	// Establish a debounced regex, so that not every change immediately recomputes.
	const computedRegex = computed(() => {
		return toValue(maybeRefFilter).regex
	})
	const debouncedRegex = refDebounced(computedRegex, 500)
	return computed<Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer>>(() => {
		const offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer> = new Map()
		// const { _offers: offers, queueSet } = useDebouncedReactiveMap<BulkyBazaarOffer['uuid'], BulkyBazaarOffer>()
		const store = toValue(maybeRefStore)

		// Check if there is a better way than initializing a filter with the debounced regex.
		// This looks clunky.
		// const filter = toValue(maybeRefFilter)
		const filter = {
			regex: debouncedRegex.value,
			multiplier: toValue(maybeRefFilter).multiplier,
			fullBuyout: toValue(maybeRefFilter).fullBuyout,
			fields: toValue(maybeRefFilter).fields,
			category: toValue(maybeRefFilter).category,
			fullSets: toValue(maybeRefFilter).fullSets,
			alwaysMaxQuantity: toValue(maybeRefFilter).alwaysMaxQuantity,
			uuid: toValue(maybeRefFilter).uuid,
			name: toValue(maybeRefFilter).name,
		}

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

			// Clone the offer, so that not every change triggers an update.
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
			offers.set(offer.uuid, offerClone)
			// queueSet(offer.uuid, offer)
		})

		return offers
	})
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
