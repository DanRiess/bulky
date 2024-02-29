import { FilteredListingDisplayValues } from '@web/types/bulky.types'

export function craftWhisperMessage(listing: FilteredListingDisplayValues) {
	const comuputedItemText = listing.filteredPayload
		.map(i => {
			return `${i.amount}x ${i.name} (${i.price}c each)`
		})
		.join(', ')

	return `Hi ${listing.ign}, I'd like to buy your ${comuputedItemText} for ${
		listing.totalPrice.divine > 0 ? listing.totalPrice.divine + ' div ' : ''
	}${listing.totalPrice.chaos} chaos.`
}
