/**
 * This store aims to implement smart rate-limiting. Instead of blindly triggering
 * a rate limit response and activating the assiciated timeout, it calculates if
 * a given request would trigger the rate limit response and will prematurely block
 * it.
 *
 * The advantage is that by not triggering the rate-limit response from the server,
 * the request can be repeated much sooner. A helper function to calculate this
 * will be provided as well.
 *
 * All of these calculations can only be taken as estimates. The request times saved
 * on the server will not match the ones here perfectly. Also, desktop apps share
 * enpoint rate limits for PoE. If the user works with i. e. Exilence at the same
 * time, numbers here will be off. This means that rate-limit responses can still occur
 * even though calculations here would say otherwise. Proper error handling MUST
 * NOT be neglected.
 */

import { BulkyError } from '@shared/errors/bulkyError'
import { ApiType, RateLimits, RequestTimestamps } from '@web/api/api.types'
import { AxiosResponse } from 'axios'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useRateLimitStore = defineStore('rateLimitStore', () => {
	/**
	 * Rate limits for the rate-limited APIS.
	 *
	 * Each API can have multiple test periods as defined in the testPeriod property.
	 * All test periods have to be checked in the respective functions.
	 * As an example, the PoE API currently has a 15s and a 60s rate limit. As such,
	 * the first entry in any properties value array is for the 15s limit, the second
	 * entry is for the 60s entry.
	 *
	 * Important: Test periods have to be listed in descending order!
	 */
	const rateLimits = ref<RateLimits>({
		poe: {
			testPeriod: [60, 15], // test periods. 15 and 60 seconds
			current: [0, 0], // currenct requests in the respective test period
			max: [30, 10], // maximum number of allowed request per respective test period
			timeout: [300, 60], // timeout per respective test period if the rate limit is breached
			activeTimeout: [0, 0], // currently active timeout per respective test period
		},
		bulky: {
			testPeriod: [60, 15], // test periods. 15 and 60 seconds
			current: [0, 0], // currenct requests in the respective test period
			max: [30, 10], // maximum number of allowed request per respective test period
			timeout: [300, 60], // timeout per respective test period if the rate limit is breached
			activeTimeout: [0, 0], // currently active timeout per respective test period
		},
	})

	/** Timestamps of fired requests to rate-limited APIs. */
	const requestTimestamps = ref<RequestTimestamps>({
		poe: [],
		bulky: [],
	})

	// METHODS
	/**
	 * Add a timestamp to the desired API. Will add a simulated 1 second server delay.
	 */
	function addTimestamp(apiType: ApiType) {
		if (apiType === 'node' || apiType === 'other') return

		// add a 1 second delay to generously estimate server delay
		requestTimestamps.value[apiType].push(Date.now() + 1000)

		// add 1 to all 'current' values in rate limits
		for (let i = 0; i < rateLimits.value[apiType].testPeriod.length; ++i) {
			++rateLimits.value[apiType].current[i]
		}

		console.log('added stamps')
		console.log(rateLimits.value[apiType])
	}

	/**
	 * Calculate rate limits depending on the collected timestamps and the current time.
	 *
	 * This function will update the reactive rateLimits variable with values for each
	 * test period and will also remove any timestamps older than the largest test period.
	 *
	 * Important: This calculation can only provide a best-guess. Multiple apps may share
	 * the same rate limits, which it cannot know about in advance. You MUST NOT replace
	 * the 429 error code handling with this.
	 */
	function calculateCurrentRateLimits(apiType: ApiType) {
		if (apiType === 'node' || apiType === 'other') return

		const timestamps = requestTimestamps.value[apiType]
		const limits = rateLimits.value[apiType]

		// Array to collect the offsets for each rate limit period
		let offsets: number[] = Array(limits.testPeriod.length).fill(0)
		const currentTime = Date.now()

		for (let i = 0; i < timestamps.length; ++i) {
			const timestampAge = currentTime - timestamps[i]
			let offsetIncreased = false

			limits.testPeriod.forEach((period, periodIdx) => {
				// if the current timestamp's age is larger than the test period, increase the period's offset
				if (timestampAge > period * 1000) {
					++offsets[periodIdx]
					offsetIncreased = true
				}
			})

			// If the offset wasn't increased for any period, it means all subsequest requests must also be
			// a part of every interval. It's safe to break the loop here
			if (offsetIncreased === false) {
				break
			}
		}

		// update rate limits
		for (let i = 0; i < limits.testPeriod.length; ++i) {
			limits.current[i] = timestamps.length - offsets[i]
		}

		// remove entries older than the largest test period
		if (offsets[0] > 0) {
			timestamps.splice(0, offsets[0])
		}
	}

	/**
	 * Calculate if the attempted amount of requests should be allowed or not.
	 * True means requests should be blocked.
	 */
	function blockRequest(apiType: ApiType, attemptedRequests = 1) {
		if (apiType === 'node' || apiType === 'other') return false

		calculateCurrentRateLimits(apiType)
		const limits = rateLimits.value[apiType]

		const activeTimeout = limits.activeTimeout.some(t => t > 0)
		const current = limits.current.some((curr, idx) => curr + attemptedRequests > limits.max[idx])

		if (activeTimeout || current) return true

		return false
	}

	/**
	 * Calculates the timeout until a given amount of requests can be executed
	 * without running into a rate limit response.
	 */
	function calculateTimeToRequest(apiType: ApiType, requestAmount = 1) {
		const result = {
			timeout: 0,
			possibleNow: 1000,
		}

		if (apiType === 'node' || apiType === 'other') return result

		const limits = rateLimits.value[apiType]
		const timestamps = requestTimestamps.value[apiType]
		const currentTime = Date.now()

		if (requestAmount < 0 || requestAmount > Math.min(...limits.max)) {
			throw new BulkyError({
				message: `The request amount must be between 0 and ${Math.min(...limits.max)}`,
			})
		}

		// calculate updated rate limits
		calculateCurrentRateLimits(apiType)

		const possibleNowArray: number[] = []
		const timeoutArray: number[] = []

		for (let i = 0; i < limits.testPeriod.length; ++i) {
			const possible = limits.max[i] - limits.current[i]
			possibleNowArray[i] = possible

			// if possible requests are higher than the requested amount, return 0
			if (possible >= requestAmount) {
				timeoutArray[i] = 0
				continue
			}

			// calculate the amount of timestamps that need to expire
			const needToExpire = requestAmount - possible

			// find the timestamp index of the first entry that falls into this test period
			// and add the amount of indices that need to expire before reattempting request
			const idxToExpire =
				timestamps.findIndex(timestampAge => timestampAge > currentTime - limits.testPeriod[i] * 1000) + needToExpire

			const exactTimeToRequest = Math.max(0, timestamps[idxToExpire] + limits.testPeriod[i] * 1000 - currentTime)

			// round to the next second
			const timeToRequest = Math.ceil(exactTimeToRequest / 1000) * 1000

			timeoutArray[i] = timeToRequest
		}

		result.possibleNow = Math.min(...possibleNowArray)
		result.timeout = Math.max(...timeoutArray)
		return result
	}

	/**
	 * Consume response headers and extract the rate limit headers from there.
	 * This function will update the reactive rateLimits variable with the received
	 * values from the server.
	 *
	 * If the returned 'current' values are higher than the ones calculated, assume that
	 * another app was using the endpoints and add the according number of timestamps
	 * to the reactive array to take those extra requests into account for the next calculation.
	 */
	function updateRateLimitsFromHeaders(apiType: ApiType, headers: AxiosResponse['headers']) {
		if (
			apiType === 'node' ||
			apiType === 'other' ||
			!headers['x-rate-limit-account'] ||
			!headers['x-rate-limit-account-state']
		)
			return

		calculateCurrentRateLimits(apiType)
		const timestamps = requestTimestamps.value[apiType]
		const limits = rateLimits.value[apiType]

		const maxLimitString = headers['x-rate-limit-account'] as string
		const currentLimitString = headers['x-rate-limit-account-state'] as string

		const headerMaxLimits = maxLimitString.split(',')
		const headerCurrentLimits = currentLimitString.split(',')

		if (headerMaxLimits.length !== headerCurrentLimits.length) {
			// TODO: error handling
			console.log('header responses have unequal length')
			return
		}

		// In the next section, a delta between the 'current' rate limit
		// requests from the header and the 'current' rate limit from the
		// reactive variable will be determined. Save these deltas here.
		const savedRequestDeltas: number[] = []

		headerMaxLimits.forEach(maxLimitString => {
			const maxLimitValues = maxLimitString.split(':')
			if (maxLimitValues.length !== 3) {
				// TODO: error handling
				console.log('rate limit headers have unknown structure')
				return
			}

			// get the values from the max limit header
			const max = parseInt(maxLimitValues[0])
			const testPeriod = parseInt(maxLimitValues[1])
			const timeout = parseInt(maxLimitValues[2])

			// find the
			const regex = new RegExp(`:${testPeriod}:`, 'ig')
			const currentLimitString = headerCurrentLimits.find(h => h.match(regex))
			const currentLimitValues = currentLimitString?.split(':')
			if (currentLimitValues?.length !== 3) {
				// TODO: error handling
				console.log('rate limit header structure unknown')
				return
			}

			const current = parseInt(currentLimitValues[0])
			const activeTimeout = parseInt(currentLimitValues[2])

			// get the index of the properties in the reactive rateLimits variable that should be updated
			const reactiveLimitIndex = limits.testPeriod.findIndex(p => p === testPeriod)

			if (reactiveLimitIndex === -1) {
				// TODO: error handling
				console.log('unknown test period')
				return
			}

			// Check if the returned 'current' value is larger than the saved 'current' value.
			// If yes, assume that another application has used the same rate limits and some
			// dummy timestamps to simulate this.
			const timestampsToAdd = Math.max(0, current - limits.current[reactiveLimitIndex])
			savedRequestDeltas[reactiveLimitIndex] = timestampsToAdd

			// update all values
			limits.current[reactiveLimitIndex] = current
			limits.max[reactiveLimitIndex] = max
			limits.timeout[reactiveLimitIndex] = timeout
			limits.activeTimeout[reactiveLimitIndex] = activeTimeout
		})

		// Iterate over the savedRequestDeltas and insert dummy timestamps
		// if necessary. Different deltas have to inserted at different
		// positions. E.g. if the 60s test period is off by 1 and the 15s
		// test period is accurate, then the dummy timestamp has to be at
		// most Date.now() - 15001 to not appear in future 15s test period
		// checks. That also means it must be spliced into the array.
		for (let i = savedRequestDeltas.length - 1; i >= 0; --i) {
			// last index (smallest test period). dummies can be pushed here.
			if (savedRequestDeltas[i + 1] === undefined) {
				const amountToInsert = savedRequestDeltas[i]
				const dummy = Date.now()
				timestamps.push(...Array(amountToInsert).fill(dummy))
			} else {
				const amountToInsert = Math.max(0, savedRequestDeltas[i] - savedRequestDeltas[i + 1])
				const dummy = Date.now() - limits.testPeriod[i + 1] * 1001
				const insertionIndex = timestamps.findIndex(ts => ts > dummy)
				if (insertionIndex === -1) {
					timestamps.push(...Array(amountToInsert).fill(dummy))
				} else {
					timestamps.splice(insertionIndex, 0, ...Array(amountToInsert).fill(dummy))
				}
			}
		}
	}

	return {
		rateLimits,
		blockRequest,
		updateRateLimitsFromHeaders,
		addTimestamp,
		calculateTimeToRequest,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRateLimitStore, import.meta.hot))
}
