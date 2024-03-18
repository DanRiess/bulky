/**
 * This store contains a list of the player's stashes and (for the ones that have been snapshot)
 * a list of that stash's unmodified items.
 */

import { getStashTabListRequest } from '@web/api/poeApi'
import { useApi } from '@web/api/useApi'
import { StashTabListItemDto } from '@web/types/dto.types'
import { StashTab } from '@web/types/stash.types'
import { BULKY_STASH_TABS } from '@web/utility/stastTab'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useStashStore = defineStore('stashStore', () => {
	const stashTabs = ref<StashTab[]>([])
	const lastListFetch = ref(0)

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
	 */
	async function fetchStashTabList() {
		// return if the stash tab list was fetched less than an hour ago
		if (Date.now() - lastListFetch.value < 3_600_000) return

		const request = useApi('stashTabList', getStashTabListRequest)
		await request.exec({ url: 'http://localhost:5173/src/mocks/stash_list.json' })

		if (request.error.value || !request.data.value) {
			console.log('could not find stash list')
			return
		}

		lastListFetch.value = Date.now()
		request.data.value.tabs.forEach(tab => addOrModifyStashTabListItem(tab))
	}

	return {
		stashTabs,
		lastListFetch,
		fetchStashTabList,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}
