import { BulkyItemRecord, TotalPrice } from '@shared/types/bulky.types'
import { MaybeRef, computed, toValue } from 'vue'

export function useAggregateItemPrice(items: MaybeRef<BulkyItemRecord>, multiplier: number, chaosPerDiv: MaybeRef<number>) {
	return computed<TotalPrice>(() => {
		let price = 0

		toValue(items).forEach(item => {
			if (!item.selected) return
			if (toValue(item.priceOverride) > 0) {
				price += toValue(item.priceOverride) * item.quantity
				return
			}
			price += toValue(item.price) * item.quantity * multiplier
		})

		return {
			divine: Math.floor(price / toValue(chaosPerDiv)),
			chaos: Math.floor(price % toValue(chaosPerDiv)),
		}
	})
}
