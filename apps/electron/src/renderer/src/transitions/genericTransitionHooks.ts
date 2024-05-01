import gsap from 'gsap'
import { computed } from 'vue'

/**
 * Returns hooks that can be fed into the transition atom component.
 * Transitions the element from height 0 to auto.
 * An additional transform can be provided.
 */
export function useGenericTransitionHooks(options: gsap.TweenVars = {}) {
	function onEnter(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		const duration = options.duration ?? 0.5

		gsap.from(el, {
			...options,
			duration,
			ease: 'ease',
			onComplete: done,
		})
	}

	function onLeave(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		const duration = (options.duration ?? 0.5) as number

		gsap.to(el, {
			...options,
			duration: duration * 0.6,
			onComplete: done,
		})
	}

	// These 2 function are necessary because of a Vue internals bug.
	// While hovering over a leaving element that is a child of an element with mouse listeners,
	// Vue will throw 'Cannot read properties of null (reading 'insertBefore')'.
	function onBeforeLeave(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.pointerEvents = 'none'
	}

	function onAfterLeave(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.pointerEvents = 'unset'
	}

	return computed(() => {
		return {
			enter: onEnter,
			leave: onLeave,
			beforeLeave: onBeforeLeave,
			afterLeave: onAfterLeave,
		}
	})
}
