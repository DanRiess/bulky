import { BulkyBazaarItem, BulkyFilter, Category, ComputedBulkyOfferStore, TotalPrice } from '@shared/types/bulky.types'
import { BULKY_TRANSFORM } from './transformers'
import { MaybeComputedRef } from '@shared/types/utility.types'
import { toValue } from 'vue'

export function generateWhisperMessage(
	category: Category,
	league: string,
	filter: BulkyFilter,
	items: MaybeComputedRef<BulkyBazaarItem[]>,
	price: MaybeComputedRef<TotalPrice>,
	priceComputeFn: ComputedBulkyOfferStore['calculateBaseItemPrice']
) {
	let itemText = ''

	if (filter.fullBuyout) {
		itemText = `full ${BULKY_TRANSFORM.stringToDisplayValue(category)} listing`
	} else {
		itemText = toValue(items)
			.map(item => {
				// Calculate the quantity.
				const filterField = filter.fields.find(field => field.type === item.type && field.tier === item.tier)
				const quantity = filter.alwaysMaxQuantity || filter.fullBuyout ? item.quantity : filterField?.quantity ?? 0

				// Return the string
				return `${quantity}x ${item.name} (${priceComputeFn(item, filter)}c each)`
			})
			.join(', ')
	}

	return `Hi, I'd like to buy your ${itemText} for ${
		toValue(price).divine > 0 ? Math.round(toValue(price).divine) + ' div ' : ''
	}${Math.round(toValue(price).chaos)} chaos in ${league}.`
}
