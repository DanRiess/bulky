/**
 * This store contains a list of the player's stashes and (for the ones that have been snapshot)
 * a list of that stash's unmodified items.
 */

import { BULKY_STASH_TABS } from '@web/utility/stastTab'
import { BULKY_ID } from '@web/utility/typedId'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { isEqual } from 'lodash'
import { useApi } from '@web/api/useApi'
import { poeApi } from '@web/api/poeApi'
import { useConfigStore } from './configStore'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { PoeStashTabDto } from '@shared/types/dtoResponse.types'
import { PoeStashTab } from '@shared/types/poe.types'

export const useStashStore = defineStore('stashStore', () => {
	const configStore = useConfigStore()
	const bulkyIdb = useBulkyIdb()

	// STATE

	const stashTabs = ref<PoeStashTab[]>([])
	const lastListFetch = ref(0)
	const fetchTimeout = ref(15000)

	// GETTERS

	const selectedStashTabs = computed(() => {
		return stashTabs.value.filter(tab => tab.selected)
	})

	// METHODS

	/**
	 * Get a stash tab by its id.
	 */
	function getStashTabById(id: PoeStashTab['id']) {
		return stashTabs.value.find(t => t.id === id)
	}

	/**
	 * Initialize the stashes from the last session / save.
	 * Should only be called on app startup or when the league config changes.
	 */
	async function initialize() {
		try {
			// get lst saved stashes from idb
			const league = configStore.config.league
			const tabs = await bulkyIdb.getStashTabsByLeague(league)
			const sortedTabs = tabs.toSorted((a, b) => a.index - b.index)

			// If tabs are empty array, push the entire read array.
			// Otherwise, replace old stashes and push the ones that don't exist yet.
			if (stashTabs.value.length === 0) {
				stashTabs.value.push(...sortedTabs)
			} else {
				sortedTabs.forEach(t => {
					const tabIndex = stashTabs.value.findIndex(stashTab => stashTab.id === t.id)
					tabIndex > -1 ? stashTabs.value.splice(tabIndex, 1, t) : stashTabs.value.push(t)
				})
			}
		} catch (e) {
			console.log('error loading user stash tabs. using empty stash tab list instead.')
		}
	}

	/**
	 * Consume a stash tab dto and type and validate it.
	 */
	function generateTypedStashTab(dto: Omit<PoeStashTabDto, 'items'>, parent?: PoeStashTab): PoeStashTab[] {
		const name = dto.name
		const index = dto.index ?? 99999
		const id = BULKY_ID.generateTypedId<PoeStashTab>(dto.id)
		const type = BULKY_STASH_TABS.generateStashTabTypeFromDto(dto.type)
		const color = dto.metadata.colour
		const lastSnapshot = 0
		const selected = false
		const league = configStore.config.league
		const parentId = parent?.id

		const tab: PoeStashTab = { name, index, id, parentId, type, lastSnapshot, color, selected, league }

		// process the folder's children
		const children = dto.children
			?.map(child => {
				return generateTypedStashTab(child, tab)
			})
			.filter(Boolean)
			.flat()

		if (parent) {
			parent.children ? parent.children.push(id) : (parent.children = [id])
		}

		return children ? [tab, ...children] : [tab]
	}

	/**
	 * Compare current stash tabs with new downloaded ones.
	 * Replace, add, or remove changed stash tabs from the state variable and indexeddb.
	 */
	async function compareStashTabs(newStashTabs: PoeStashTab[]) {
		// Find all tabs that don't exist in the newStashTabs anymore.
		// This should only apply to remove-only tabs that have been cleared.
		const remove = stashTabs.value
			.map((oldTab, idx) => {
				if (oldTab.name.match(/\(remove-only\)/gi) && !newStashTabs.some(newTab => isEqual(newTab, oldTab))) {
					return { id: oldTab.id, idx }
				}
				return null
			})
			.filter(Boolean)
			.sort((a, b) => a.idx - b.idx)

		// Find all tabs that are either new or have changed data (different name for example).
		const add = newStashTabs.filter(newTab => !stashTabs.value.some(oldTab => isEqual(newTab, oldTab)))

		// Remove stash tabs from the state variable.
		for (let i = remove.length - 1; i >= 0; --i) {
			stashTabs.value.splice(remove[i].idx, 1)
		}

		// Add new tabs or edit the ones with changes.
		add.forEach(tab => {
			const idx = stashTabs.value.findIndex(t => t.id === tab.id)

			// If the index is 0 or higher, a tab with the same id already exists. Replace it.
			// Otherwise, push the new tab to the array.
			idx > -1 ? stashTabs.value.splice(idx, 1, tab) : stashTabs.value.push(tab)
		})

		// Sort the tabs.
		stashTabs.value.sort((a, b) => a.index - b.index)

		// Remove and add stash tabs from indexed db.
		await bulkyIdb.deleteStashTabs(remove.map(r => r.id))
		await bulkyIdb.putStashTabs(add)
	}

	/**
	 * Fetch a list of all stash tabs. Only allow this once per hour.
	 * Only add new stash tabs to the array, don't replace old ones. This would replace its items.
	 */
	function getStashTabListRequest() {
		const request = useApi('stashListRequest', poeApi.getStashTabList)

		async function execute() {
			// Return if the request is already in progress
			if (request.status.value === 'PENDING') return

			// Execute the request
			await request.exec()

			// Error handling
			if (request.error.value || !request.data.value) {
				// TODO: error handling
				console.log('could not find stash list')
				return
			}

			// Set the last fetch time to now to throttle fetch requests.
			lastListFetch.value = Date.now()
			const typedStashTabs = request.data.value.stashes.map(tab => generateTypedStashTab(tab)).flat()

			// Compare and save changes into the state variable and idb.
			await compareStashTabs(typedStashTabs)
		}

		return { request, execute }
	}

	/**
	 * Reset the state.
	 * I. e. when the user changes the league in the config
	 */
	function reset() {
		stashTabs.value.length = 0
		lastListFetch.value = 0
	}

	return {
		stashTabs,
		selectedStashTabs,
		lastListFetch,
		fetchTimeout,
		initialize,
		getStashTabById,
		getStashTabListRequest,
		reset,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useStashStore, import.meta.hot))
}
