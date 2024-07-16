import { BulkyBazaarOffer } from '@shared/types/bulky.types'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'

export function craftWhisperMessage(offer: BulkyBazaarOffer) {
	const comuputedItemText = offer.items
		.map(i => {
			return `${i.quantity}x ${i.name} (${i.price}c each)`
		})
		.join(', ')

	const divPrice = useChaosToDiv(offer.fullPrice, offer.chaosPerDiv)

	if (!divPrice.value) return

	return `Hi ${offer.ign}, I'd like to buy your ${comuputedItemText} for ${
		divPrice.value.divine > 0 ? divPrice.value.divine + ' div ' : ''
	}${divPrice.value.chaos} chaos.`
}
