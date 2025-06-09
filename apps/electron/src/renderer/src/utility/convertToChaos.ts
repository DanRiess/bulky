import { TotalPrice } from '@shared/types/bulky.types'
import { MaybeRefOrGetter, toValue } from 'vue'

export function convertToChaos(totalPrice: MaybeRefOrGetter<TotalPrice>, cpd: MaybeRefOrGetter<number>) {
	const total = toValue(totalPrice)
	return total.divine * toValue(cpd) + total.chaos
}
