import gsap from 'gsap'
import { computed } from 'vue'

/**
 * Returns hooks that can be fed into the transition atom component.
 * Transitions the element from height 0 to auto.
 * An additional transform can be provided.
 */
export function useRouteTransitionHooks() {
	function onBeforeEnter(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.transformOrigin = 'top'
	}

	function onEnter(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		gsap.from(el, {
			scaleY: 0.01,
			opacity: 0,
			duration: 0.35,
			ease: 'ease',
			onComplete: done,
		})
	}

	// onBeforeLeave and onAfterLeave are necessary because of a Vue internals bug.
	// While hovering over a leaving element that is a child of an element with mouse listeners,
	// Vue will throw 'Cannot read properties of null (reading 'insertBefore')'.
	function onBeforeLeave(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.pointerEvents = 'none'
		el.style.transformOrigin = 'left'
	}

	function onLeave(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		gsap.to(el, {
			scaleX: 0.01,
			opacity: 0,
			duration: 0.25,
			onComplete: done,
		})
	}

	function onAfterLeave(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.pointerEvents = 'unset'
	}

	return computed(() => {
		return {
			beforeEnter: onBeforeEnter,
			enter: onEnter,
			leave: onLeave,
			beforeLeave: onBeforeLeave,
			afterLeave: onAfterLeave,
		}
	})
}
