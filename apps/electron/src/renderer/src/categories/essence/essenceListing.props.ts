import { transformToDisplayValue } from '@web/utility/transformers'
import { ComputedItemDisplayValues, ComputedListingDisplayValues } from '@web/types/bulky.types'
import { useEssenceListingStore } from './essenceListing.store'
import { useEssenceFilterStore } from './essenceFilter.store'
import { EssenceType } from './essence.types'

/**
 * Not really a composable, as it doesn't return reactive state.
 * It HAS to be wrapped in a computed property to be useful, but it can't be done here.
 * Reason is that this list should only be active when the category is Compass, otherwise another category's list will be loaded.
 * The correct list to be loaded needs to be computed elsewhere, which is why the computed prop needs to be there, not here.
 *
 * @example
 * const displayProps = computed(() => {
 * 		if (someCondition) return useCompassListingProps()
 * })
 */
export function useEssenceListingProps(): ComputedListingDisplayValues[] {
	const compassListingStore = useEssenceListingStore()
	const compassFilterStore = useEssenceFilterStore()

	const filter = compassFilterStore.currentFilter
	if (!filter) return []

	return [...compassListingStore.listings]
		.map(([_, listing]) => {
			const ign = listing.ign
			const chaosPerDiv = listing.chaosPerDiv
			const uuid = listing.uuid
			const messageSent = listing.messageSent
			const multiplier = listing.multiplier

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
				let prop: EssenceType
				for (prop in listing.items) {
					// return a filtereddisplayitem of every single listing
					listing.items[prop]?.forEach(listing => {
						computedItems.push({
							name: transformToDisplayValue(prop),
							secondaryOption: transformToDisplayValue(listing.tier),
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
}
