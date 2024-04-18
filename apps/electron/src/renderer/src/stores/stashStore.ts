/**
 * This store contains a list of the player's stashes and (for the ones that have been snapshot)
 * a list of that stash's unmodified items.
 */

import { useApi } from '@web/api/useApi'
import { StashTabListItemDto } from '@shared/types/dto.types'
import { StashTab } from '@shared/types/stash.types'
import { BULKY_STASH_TABS } from '@web/utility/stastTab'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { poeApi } from '@web/api/poeApi'

export const useStashStore = defineStore('stashStore', () => {
	const stashTabs = ref<StashTab[]>([])
	const lastListFetch = ref(0)
	const fetchTimeout = ref(5000)
	const stashListRequest = useApi('stashTabList', poeApi.getStashTabList)

	/**
	 * Initialize the stashes from the last session / save. Should only be called once on app startup.
	 */
	async function initialize() {
		try {
			const tabs = await window.api.readStashTabs()

			// If tabs are empty array, push the entire read array.
			// Otherwise, replace old stashes and push the ones that don't exist yet.
			if (stashTabs.value.length === 0) {
				stashTabs.value.push(...tabs)
			} else {
				tabs.forEach(t => {
					const tabIndex = stashTabs.value.findIndex(stashTab => stashTab.id === t.id)
					tabIndex > -1 ? stashTabs.value.splice(tabIndex, 1, t) : stashTabs.value.push(t)
				})
			}
		} catch (e) {
			console.log('error loading user stash tabs. using empty stash tab list instead.')
		}
	}

	/**
	 * Consume a stashtab dto, type and validate it and add it to the stashTabs.
	 * The method to filter out existing stashes is highly inefficient at O(n²),
	 * but for the number of stashes of a standard player, this shouldn't matter too much.
	 */
	function addOrModifyStashTabListItem(dto: StashTabListItemDto) {
		const existingTab = stashTabs.value.find(t => t.id === dto.id)

		// if the tab exists already, just update its name
		if (existingTab) {
			existingTab.name = dto.n
			existingTab.type = BULKY_STASH_TABS.generateStashTabTypeFromDto(dto.type)
		} else {
			const name = dto.n
			const id = dto.id
			const type = BULKY_STASH_TABS.generateStashTabTypeFromDto(dto.type)
			const lastSnapshot = 0
			const items = []
			const selected = false

			stashTabs.value.push({ name, id, type, lastSnapshot, items, selected })
		}
	}

	/**
	 * Fetch a list of all stash tabs. Only allow this once per hour.
	 * Only add new stash tabs to the array, don't replace old ones. This would replace its items.
	 */
	async function fetchStashTabList() {
		// return if the stash tab list was fetched less than an hour ago
		if (Date.now() - lastListFetch.value < fetchTimeout.value) return

		// return if the status is not idle
		if (stashListRequest.status.value === 'PENDING') return

		// execute the request
		await stashListRequest.exec()

		// error handling
		if (stashListRequest.error.value || !stashListRequest.data.value) {
			console.log('could not find stash list')
			return
		}

		// set the last fetch time to now to throttle fetch requests
		lastListFetch.value = Date.now()
		stashListRequest.data.value.tabs.forEach(tab => addOrModifyStashTabListItem(tab))

		// reset the request to be able to repeat it later
		setTimeout(() => {
			stashListRequest.reset()
		}, 2000)
	}

	return {
		stashTabs,
		lastListFetch,
		fetchTimeout,
		stashListRequest,
		initialize,
		fetchStashTabList,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}
