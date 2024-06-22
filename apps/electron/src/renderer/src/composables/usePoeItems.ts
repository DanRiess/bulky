import { getKeys, isWatchable } from '@shared/types/utility.types'
import { isEqual } from 'lodash'
import { useBulkyIdb } from './useBulkyIdb'
import { compareObjectsByBaseType } from '@web/utility/compareFunctions'
import { MaybeRefOrGetter, computed, ref, toValue, watch } from 'vue'
import { PoeItemsByStash, PoeStashTab } from '@shared/types/poe.types'
import { BULKY_CATEGORIES } from '@web/utility/category'
import { Category } from '@shared/types/bulky.types'

/**
 * Compose a ref of items from currently selected stash tabs.
 * The items variable will update itself when the stash tab selection changes.
 * A change can be forced by calling the exposed 'update' function, i. e. after a folder sync.
 */
export function usePoeItems(stashTabs: MaybeRefOrGetter<PoeStashTab[]>) {
	const bulkyIdb = useBulkyIdb()
	const itemsByStash = ref<PoeItemsByStash>({})

	// Load items of selected tabs from idb.
	;(async function initialize() {
		await Promise.allSettled(
			toValue(stashTabs).map(async stashTab => {
				const bulkyItems = (await bulkyIdb.getItemsByStashTab(stashTab.id)).sort(compareObjectsByBaseType)
				itemsByStash.value[stashTab.id] = bulkyItems
			})
		)
	})().catch(e => {
		console.log(e)
	})

	// Create a watcher that updates the items when stash selection changes.
	// Update here means fetching new tab's items from idb and deleting removed tab's items from the variable.
	// The comparison inside the watcher is only possible with a ComputedRef!
	if (isWatchable(stashTabs)) {
		watch(stashTabs, (newTabs, oldTabs) => {
			// compare which tabs have been added and which have been removed
			const remove = oldTabs.filter(val => !newTabs.includes(val))
			const add = newTabs.filter(val => !oldTabs.includes(val))

			// remove necessary items (items[id].length = 0)
			remove.forEach(tab => itemsByStash.value[tab.id] && (itemsByStash.value[tab.id].length = 0))

			// get new tabs' items from indexeddb
			add.forEach(tab => {
				bulkyIdb.getItemsByStashTab(tab.id).then(newItems => {
					itemsByStash.value[tab.id] = newItems
				})
			})
		})
	}

	// METHODS

	function filterItemsByCategory(category: Category) {
		return computed(() => {
			return getKeys(itemsByStash.value).reduce((prev, curr) => {
				prev[curr] = itemsByStash.value[curr].filter(item =>
					BULKY_CATEGORIES.isBaseTypeInCategory(category, item.baseType)
				)
				return prev
			}, {} as PoeItemsByStash)
		})
	}

	/**
	 * Update the items after a stash sync action.
	 * This is also possible as a watcher if downloaded items are passed to the use function as Ref.
	 */
	async function updateItemsByStash(downloadedItems: PoeItemsByStash) {
		// Find all items that don't exist in the downloaded items anymore.
		const remove = getKeys(downloadedItems)
			.map(key => {
				return itemsByStash.value[key]
					.map((oldItem, idx) => {
						if (!downloadedItems[key].some(newItem => isEqual(newItem, oldItem))) {
							return { id: oldItem.id, idx, stashTabId: key }
						}
						return null
					})
					.filter(Boolean)
					.sort((a, b) => a.idx - b.idx)
			})
			.flat()

		// Find all items that are either new or have changed data (different stack size for example).
		const add = getKeys(downloadedItems)
			.map(key => {
				return downloadedItems[key].filter(
					downloadedItem => !itemsByStash.value[key].some(oldItem => isEqual(oldItem, downloadedItem))
				)
			})
			.flat()

		// Remove items from the state variable.
		for (let i = remove.length - 1; i >= 0; --i) {
			const key = remove[i].stashTabId
			itemsByStash.value[key].splice(remove[i].idx, 1)
		}

		// Add new items or edit the ones with changes.
		add.forEach(downloadedItem => {
			const key = downloadedItem.stashTabId
			const idx = itemsByStash.value[key].findIndex(oldItem => oldItem.id === downloadedItem.id)

			// If the index is 0 or higher, an item with the same id already exists. Replace it.
			// Otherwise, push the new item to the array.
			idx > -1 ? itemsByStash.value[key].splice(idx, 1, downloadedItem) : itemsByStash.value[key].push(downloadedItem)
		})

		// Sort the items.
		getKeys(itemsByStash.value).forEach(stashTabId => itemsByStash.value[stashTabId].sort(compareObjectsByBaseType))

		// Update idb to reflect the changes
		await bulkyIdb.deleteItems(remove.map(r => r.id))
		await bulkyIdb.putItems(add)
	}

	return { itemsByStash, updateItemsByStash, filterItemsByCategory }
}
