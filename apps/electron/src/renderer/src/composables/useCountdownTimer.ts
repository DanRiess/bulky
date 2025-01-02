import { ref } from 'vue'

/**
 * Initialize a countdown timer that executes the provided callback when it reaches 0.
 *
 * ALL PARAMETERS ARE INTERPRETED IN SECONDS, NOT MILLISECONDS.
 *
 * Returns the time remaining and a setter.
 * When invoking the setter, the countdown resets to the provided values.
 */
export function useCountdownTimer(initialTimer: number, cb: Function, timeoutInterval = 1) {
	// INTERNAL STATE
	let timeout: NodeJS.Timeout | undefined

	// STATE
	const callback = ref(cb)
	const timeRemaining = ref(initialTimer)
	const interval = ref(timeoutInterval)

	// METHODS
	function countdown() {
		timeout = setTimeout(() => {
			timeRemaining.value -= Math.max(0, timeoutInterval)

			// Clear the timeout and execute the callback.
			if (timeRemaining.value === 0) {
				clearTimeout(timeout)
				callback.value()
			} else {
				countdown()
			}
		}, interval.value * 1000)
	}

	/**
	 * Clear the current timeout.
	 * If any of the options were passed, start a new countdown.
	 */
	function resetCountdown(options?: { timeRemaining?: number; cb?: Function; timeoutInterval?: number }) {
		// Clear the current timeout.
		clearTimeout(timeout)

		if (options?.timeRemaining) timeRemaining.value = options.timeRemaining
		if (options?.cb) callback.value = options.cb
		if (options?.timeoutInterval) interval.value = options.timeoutInterval

		if (options?.timeRemaining || options?.cb || options?.timeoutInterval) {
			countdown()
		} else {
			timeRemaining.value = 0
		}
	}

	return {
		timeRemaining,
		resetCountdown,
	}
}
