import { MaybeRef, onBeforeUnmount, onMounted, toValue } from 'vue'

export function useEventListener(
	target: MaybeRef<Element | Document | undefined>,
	event: keyof ElementEventMap | keyof WindowEventMap,
	callback: EventListenerOrEventListenerObject
) {
	onMounted(() => {
		const el = toValue(target)
		if (el === undefined) return
		el.addEventListener(event, callback)
	})
	onBeforeUnmount(() => {
		const el = toValue(target)
		if (el === undefined) return
		el.removeEventListener(event, callback)
	})
}
