import { computed } from 'vue'
import { transformToDisplayValue } from '@web/utility/transformers'
import {
	AnyFilter,
	AnyListings,
	ComputedItemDisplayValues,
	ComputedListingDisplayValues,
	GenericItemData,
	ItemTier,
	ItemType,
} from '@web/types/bulky.types'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'
import { useEssenceListingStore } from '@web/categories/essence/essenceListing.store'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useCompassFilterStore } from '@web/categories/compass/compassFilter.store'

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useListingProps() {
	const appStateStore = useAppStateStore()
	const compassListingStore = useCompassListingStore()
	const compassFilterStore = useCompassFilterStore()
	const essenceListingStore = useEssenceListingStore()
	const essenceFilterStore = useEssenceFilterStore()

	return computed<ComputedListingDisplayValues[]>(() => {
		let listings: AnyListings | undefined
		let filter: AnyFilter | undefined

		if (appStateStore.selectedCategory === 'COMPASS') {
			listings = compassListingStore.listings
			filter = compassFilterStore.currentFilter
		} else if (appStateStore.selectedCategory === 'ESSENCE') {
			listings = essenceListingStore.listings
			filter = essenceFilterStore.currentFilter
		}

		if (!listings || !filter) return []

		return [...listings]
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
