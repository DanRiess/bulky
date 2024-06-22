import { computed } from 'vue'
import { transformToDisplayValue } from '@web/utility/transformers'
// import {
// 	AnyFilter,
// 	AnyListings,
// 	ComputedItemDisplayValues,
// 	ComputedListingDisplayValues,
// 	GenericItemData,
// 	ItemTier,
// 	ItemType,
// } from '@shared/types/bulky.types'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useBazaarOfferProps() {
	const appStateStore = useAppStateStore()
	const essenceOfferStore = useEssenceOfferStore()
	const essenceFilterStore = useEssenceFilterStore()

	return computed<ComputedListingDisplayValues[]>(() => {
		let offers: AnyListings | undefined
		let filter: AnyFilter | undefined

		if (appStateStore.selectedCategory === 'ESSENCE') {
			offers = essenceOfferStore.offers
			filter = essenceFilterStore.currentFilter
		}

		if (!offers || !filter) return []

		return [...offers]
			.map(([_, listing]) => {
				const ign = listing.ign
				const chaosPerDiv = listing.chaosPerDiv
				const uuid = listing.uuid
				const messageSent = listing.messageSent
				const multiplier = listing.multiplier

				// if no filter, return nothing
				if (!filter) return

				// don't return the listing if its multiplier is higher than the filter's multiplier
				if (filter.multiplier < listing.multiplier) return

				// remove duplicate filter fields
				const seen = {} as Record<string, boolean>
				const computedFilterFields = filter.fields.filter(field => {
					const name = `${field.mainOption}-${field.secondaryOption}`
					return seen.hasOwnProperty(name) ? false : (seen[name] = true)
				})

				// filter the listing by using the provided compass filter.
				// this will return an array of matched fields.
				// it needs to be type casted, as otherwise it will always be (CIDV | undefined)[], even after the check below
				const computedItems: ComputedItemDisplayValues[] = []

				if (filter.fullBuyout) {
					let prop: ItemType
					for (prop in listing.items) {
						// return a filtereddisplayitem of every single listing
						listing.items[prop]?.forEach((listing: GenericItemData<ItemTier>) => {
							computedItems.push({
								name: transformToDisplayValue(prop),
								secondaryOption: listing.tier ? transformToDisplayValue(listing.tier) : undefined,
								quantity: listing.quantity,
								price: listing.price,
								stock: listing.quantity,
							})
						})
					}
				} else {
					for (const filterField of computedFilterFields) {
						const items = listing.items[filterField.mainOption]
						if (!items) return

						const item = items.find(i => i.tier === filterField.secondaryOption)
						if (!item) return

						const price = item.price
						// if (price > (filterField.maxBuyout || Infinity)) return

						const stock = item.quantity
						if (!filter.alwaysMaxQuantity && stock < filterField.quantity) return

						// if the alwaysMaxQuantity option is toggled, set the quantity equal to the available stock
						const quantity = filter.alwaysMaxQuantity ? item.quantity : filterField.quantity

						computedItems.push({
							name: transformToDisplayValue(filterField.mainOption),
							secondaryOption: transformToDisplayValue(filterField.secondaryOption),
							quantity,
							price,
							stock,
						})
					}
				}

				// some filter fields did not match the listing => don't return the listing
				if (computedItems.some(e => e === undefined)) return

				// calculate the total price
				const totalChaos = computedItems.reduce((prev, curr) => {
					return prev + curr.price * curr.quantity
				}, 0)

				const divine = Math.floor(totalChaos / listing.chaosPerDiv)
				const chaos = totalChaos % listing.chaosPerDiv

				return {
					uuid,
					ign,
					messageSent,
					chaosPerDiv,
					multiplier,
					computedItems,
					totalPrice: { divine, chaos },
					fullBuyoutWatcher: filter.fullBuyout,
				}
			})
			.filter(Boolean)
	})
}
