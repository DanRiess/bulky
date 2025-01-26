import { PoeLeagueRecordDto, RuthlessRule, SSFRule } from '@shared/types/dtoResponse.types'
import { poeApi } from '@web/api/poeApi'
import { useApi } from '@web/api/useApi'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useLeagueStore = defineStore('leagueStore', () => {
	const leagues = ref<PoeLeagueRecordDto[]>()
	const isInitialized = ref(false)

	async function initialize() {
		if (leagues.value !== undefined || isInitialized.value) return

		const leagueRequest = useApi('leagueRequest', poeApi.getLeagues)
		await leagueRequest.exec()

		if (leagueRequest.error.value || !leagueRequest.data.value) {
			// might show error here
			return
		}

		leagues.value = filterLeagues(leagueRequest.data.value)
		isInitialized.value = true
	}

	/**
	 * Filter out all leagues that are ruthless, ssf, or both.
	 * Sort entries to list current league options first.
	 */
	function filterLeagues(leagues: PoeLeagueRecordDto[]) {
		return leagues
			.filter(league => {
				return !!!league.rules.find(rule => rule instanceof SSFRule || rule instanceof RuthlessRule)
			})
			.sort((a, b) => (a.category.current === b.category.current ? 0 : a.category.current ? -1 : 1))
	}

	return {
		leagues,
		isInitialized,
		initialize,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useLeagueStore, import.meta.hot))
}
