import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRateLimitStore = defineStore('rateLimitStore', () => {
	/** rate limit per 15 seconds */
	const rateLimit15 = ref({
		current: 0,
		max: 10,
		testPeriod: 15,
		timeout: 60,
		activeTimeout: 0,
	})

	/** rate limit per 60 seconds */
	const rateLimit60 = ref({
		current: 0,
		max: 30,
		testPeriod: 60,
		timeout: 300,
		activeTimeout: 0,
	})

	/**
	 * Calculate if the attempted amount of requests should be allowed or not.
	 * True means requests should be blocked.
	 */
	function rateLimitRequest(attemptedRequests = 1) {
		if (rateLimit15.value.activeTimeout > 0) return true
		if (rateLimit60.value.activeTimeout > 0) return true

		if (rateLimit15.value.current + attemptedRequests > rateLimit15.value.max) return true
		if (rateLimit60.value.current + attemptedRequests > rateLimit60.value.max) return true

		return false
	}

	function updateRateLimits(headers: AxiosResponse['headers']) {
		if (!headers['x-rate-limit-account'] || !headers['x-rate-limit-account-state']) return

		const limit = headers['x-rate-limit-account'] as string
		const state = headers['x-rate-limit-account-state'] as string

		const limits = limit.split(',')
		const states = state.split(',')

		limits.forEach(l => {
			const atoms = l.split(':')
			if (atoms.length !== 3) return

			const max = parseInt(atoms[0])
			const testPeriod = parseInt(atoms[1])
			const timeout = parseInt(atoms[2])

			if (testPeriod === 15) {
				rateLimit15.value.max = max
				rateLimit15.value.timeout = timeout
			} else if (testPeriod === 60) {
				rateLimit60.value.max = max
				rateLimit60.value.timeout = timeout
			} else {
				// TODO: probably throw error here
				console.log('unknown rate limit')
			}
		})

		states.forEach(s => {
			const atoms = s.split(':')
			if (atoms.length !== 3) return

			const current = parseInt(atoms[0])
			const testPeriod = parseInt(atoms[1])
			const activeTimeout = parseInt(atoms[2])

			if (testPeriod === 15) {
				rateLimit15.value.current = current
				rateLimit15.value.activeTimeout = activeTimeout
			} else if (testPeriod === 60) {
				rateLimit60.value.current = current
				rateLimit60.value.activeTimeout = activeTimeout
			} else {
				// TODO: probably throw error here
				console.log('unknown rate limit')
			}
		})
	}
})
