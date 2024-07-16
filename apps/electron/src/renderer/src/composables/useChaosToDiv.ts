import { TotalPrice } from '@shared/types/bulky.types'
import { MaybeRef, MaybeRefOrGetter, computed, toValue } from 'vue'

export function useChaosToDiv(chaosValue: MaybeRefOrGetter<number | undefined>, chaosPerDiv: MaybeRef<number>) {
	return computed<TotalPrice | undefined>(() => {
		const cVal = toValue(chaosValue)
		if (!cVal) return undefined

		return {
			divine: Math.floor(cVal / toValue(chaosPerDiv)),
			chaos: Math.floor(cVal % toValue(chaosPerDiv)),
		}
	})
}
