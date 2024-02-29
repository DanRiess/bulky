import { transformToDisplayValue } from '@web/utility/transformers'
import { useCompassFilterStore } from './compassFilterStore'
import { useCompassStore } from './compassStore'
import { FilteredPayloadDisplayItem, FilteredListingDisplayValues } from '@web/types/bulky.types'
import { SextantModifier } from '@web/types/poe.types'

/**
 * Not really a composable, as it doesn't return reactive state.
 * It HAS to be wrapped in a computed property to be useful, but it can't be done here.
 * Reason is that this list should only be active when the category is Compass, otherwise another category's list will be loaded.
 * The correct list to be loaded needs to be computed elsewhere, which is why the computed prop needs to be there, not here.
 *
 * @example
 * const displayProps = computed(() => {
 * 		if (someCondition) return useCompassDisplayProps()
 * })
 */
export function useCompassDisplayProps(): FilteredListingDisplayValues[] {
	const compassStore = useCompassStore()
	const compassFilterStore = useCompassFilterStore()

	const filter = compassFilterStore.currentFilter
	if (!filter) return []

	return [...compassStore.listings]
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
			// it needs to be type casted, as otherwise it will always be (CPDI | undefined)[], even after the check below
			const filteredPayload: FilteredPayloadDisplayItem[] = []

			if (filter.fullBuyout) {
				let prop: SextantModifier
				for (prop in listing.payload) {
					// return a filtereddisplayitem of every single listing
					listing.payload[prop]?.forEach(listing => {
						const secondaryOption = listing.uses === 16 ? 'elevated' : listing.uses === 4 ? 'awakened' : undefined
						if (!secondaryOption) return

						filteredPayload.push({
							name: transformToDisplayValue(prop),
							secondaryOption: secondaryOption,
							amount: listing.amount,
							price: listing.price,
							stock: listing.amount,
						})
					})
				}
			} else {
				for (const filterField of computedFilterFields) {
					const payloadItem = listing.payload[filterField.mainOption]
					if (!payloadItem) return

					const awakened = filterField.secondaryOption === 'AWAKENED'
					const item = awakened ? payloadItem.find(i => i.uses === 4) : payloadItem.find(i => i.uses === 16)
					if (!item) return

					const price = item.price
					// if (price > (filterField.maxBuyout || Infinity)) return

					const stock = item.amount
					if (stock < filterField.amount) return

					filteredPayload.push({
						name: transformToDisplayValue(filterField.mainOption),
						secondaryOption: filterField.secondaryOption.toLowerCase(),
						amount: filterField.amount,
						price,
						stock,
					})
				}
			}

			// const filteredPayload = computedFilterFields.map(filterField => {
			// 	const payloadItem = listing.payload[filterField.mainOption]
			// 	if (!payloadItem) return

			// 	const awakened = filterField.secondaryOption === 'AWAKENED'
			// 	const item = awakened ? payloadItem.find(i => i.uses === 4) : payloadItem.find(i => i.uses === 16)
			// 	if (!item) return

			// 	const price = item.price
			// 	// if (price > (filterField.maxBuyout || Infinity)) return

			// 	const stock = item.amount
			// 	if (stock < filterField.amount) return

			// 	return {
			// 		name: transformToDisplayValue(filterField.mainOption),
			// 		amount: filterField.amount,
			// 		price,
			// 		stock,
			// 	}
			// }) as FilteredPayloadDisplayItem[]

			// some filter fields did not match the listing => don't return the listing
			if (filteredPayload.some(e => e === undefined)) return

			// calculate the total price
			const totalChaos = filteredPayload.reduce((prev, curr) => {
				return prev + curr.price * curr.amount
			}, 0)

			const divine = Math.floor(totalChaos / listing.chaosPerDiv)
			const chaos = totalChaos % listing.chaosPerDiv

			return {
				uuid,
				ign,
				messageSent,
				chaosPerDiv,
				multiplier,
				filteredPayload,
				totalPrice: { divine, chaos },
				fullBuyoutWatcher: filter.fullBuyout,
			}
		})
		.filter(Boolean)
}
