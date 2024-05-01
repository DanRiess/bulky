import { isWatchable } from '@shared/types/utility.types'
import { ApiType } from '@web/api/api.types'
import { useRateLimitStore } from '@web/stores/rateLimitStore'
import { MaybeRef, ref, toValue, watch } from 'vue'

/**
 * Create a reactive timer that updates itself when either a new request is made
 * or the required request amount changes (has to be a ref itself to work)
 */
export function useRateLimitTimer(apiType: ApiType, requestAmount: MaybeRef<number> = 1) {
	const rateLimitStore = useRateLimitStore()

	const timer = ref(0)
	let timeout: NodeJS.Timeout

	function updateTimer() {
		timer.value = Math.max(0, timer.value)

		// Don't actually use setinterval, it has some weird edge cases in which it doesn't use the delay at all.
		if (timer.value > 0) {
			timeout = setTimeout(() => {
				--timer.value
				updateTimer()
			}, 1000)
		}
	}

	// Define the watch sources. Request amount can only be watched if a reactive variable was passed.
	// If at some point
	const watchSources = isWatchable(requestAmount)
		? [rateLimitStore.timestamps[apiType], requestAmount]
		: rateLimitStore.timestamps[apiType]

	// Update the timer when the request amount or the saved timestamp amount in the rate limit store changes.
	watch(
		watchSources,
		() => {
			timer.value = rateLimitStore.calculateTimeToRequest(apiType, toValue(requestAmount)).timeout / 1000
			timeout && clearTimeout(timeout)
			updateTimer()
		},
		{ immediate: true }
	)

	updateTimer()

	return { timer }
}
