import { TotalPrice } from '@shared/types/bulky.types'
import { MaybeRef, MaybeRefOrGetter, computed, toValue } from 'vue'

export function useChaosToDiv(chaosValue: MaybeRefOrGetter<number>, chaosPerDiv: MaybeRef<number>) {
	return computed<TotalPrice>(() => {
		return {
			divine: Math.floor(toValue(chaosValue) / toValue(chaosPerDiv)),
			chaos: Math.floor(toValue(chaosValue) % toValue(chaosPerDiv)),
		}
	})
}
