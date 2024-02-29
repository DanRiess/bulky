import gsap from 'gsap'
import { computed } from 'vue'

/**
 * Returns hooks that can be fed into the transition atom component.
 * Transitions the element from height 0 to auto.
 * An additional transform can be provided.
 */
export function useListTransition(options: gsap.TweenVars = {}) {
	function onBeforeEnter(el: Element) {
		if (!(el instanceof HTMLElement)) return

		el.style.opacity = '0'
		el.style.height = '0'
		el.style.clipPath = 'inset(0 0 100% 0)'
		el.style.marginTop = options.marginTop ? '0' : ''
	}

	function onEnter(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		const duration = options.duration ?? 0.5

		gsap.to(el, {
			opacity: 1,
			height: 'auto',
			marginTop: options.marginTop,
			clipPath: 'inset(0 0 0% 0)',
			duration,
			ease: 'ease',
			onComplete: done,
		})
	}

	function onAfterEnter(el: Element) {
		if (!(el instanceof HTMLElement)) return
		el.style.clipPath = ''
	}

	function onLeave(el: Element, done: () => void) {
		if (!(el instanceof HTMLElement)) return

		const duration = (options.duration ?? 0.5) as number

		gsap.to(el, {
			opacity: 0,
			height: 0,
			marginTop: 0,
			paddingTop: 0,
			paddingBottom: 0,
			duration: duration * 0.6,
			clipPath: 'inset(0 0 100% 0)',
			onComplete: done,
		})
	}

	return computed(() => {
		return {
			beforeEnter: onBeforeEnter,
			enter: onEnter,
			afterEnter: onAfterEnter,
			leave: onLeave,
		}
	})
}
