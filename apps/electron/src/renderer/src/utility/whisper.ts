import { ComputedListingDisplayValues } from '@shared/types/bulky.types'

export function craftWhisperMessage(listing: ComputedListingDisplayValues) {
	const comuputedItemText = listing.computedItems
		.map(i => {
			return `${i.quantity}x ${i.name} (${i.price}c each)`
		})
		.join(', ')

	return `Hi ${listing.ign}, I'd like to buy your ${comuputedItemText} for ${
		listing.totalPrice.divine > 0 ? listing.totalPrice.divine + ' div ' : ''
	}${listing.totalPrice.chaos} chaos.`
}
