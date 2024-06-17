import { toRaw, isRef, isReactive, isProxy, toValue, UnwrapNestedRefs } from 'vue'

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): UnwrapNestedRefs<T> {
	const objectIterator = (input: any): any => {
		if (Array.isArray(input)) {
			return input.map(item => objectIterator(item))
		}
		if (isRef(input)) {
			return objectIterator(toValue(input))
		}
		if (isProxy(input) || isReactive(input)) {
			return objectIterator(toRaw(input))
		}
		if (input && typeof input === 'object') {
			return Object.keys(input).reduce((acc, key) => {
				acc[key as keyof typeof acc] = objectIterator(input[key])
				return acc
			}, {} as T)
		}
		return input
	}

	return objectIterator(sourceObj)
}
