import { BulkyItemRecord, BulkyPriceOverrideRecord } from '@shared/types/bulky.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { PoeItem, PoeItemsByStash } from '@shared/types/poe.types'
import { RefOrGetter, getKeys, isWatchable } from '@shared/types/utility.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { Ref, ref, watch } from 'vue'

export function useBulkyItems(
	poeItems: RefOrGetter<PoeItemsByStash>,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyPriceOverrideRecord>
) {
	const appStateStore = useAppStateStore()

	/**
	 * Reactive map of item records.
	 * Stores records in the form [ 'itemType_itemTier', item ]
	 *
	 * @example
	 * const example = new Map([
	 * 	['GREED_DEAFENING', EssenceItem]
	 * ])
	 */
	const items = ref(new Map()) as Ref<BulkyItemRecord>

	// Create a watcher that updates the items when stash selection changes.
	// Update here means fetching new tab's items from idb and deleting removed tab's items from the variable.
	// The comparison inside the watcher is only possible with a ComputedRef!
	if (isWatchable(poeItems)) {
		watch(poeItems, (newItems, oldItems) => {
			// console.log('POE ITEMS CHANGED')
			const add = getKeys(newItems).reduce((prev, curr) => {
				prev[curr] = newItems[curr].filter(item => !oldItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)
			const remove = getKeys(oldItems).reduce((prev, curr) => {
				prev[curr] = oldItems[curr].filter(item => !newItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)

			// Check if the category has changed.
			// I did not want to create a dedicated watcher to this because I'm afraid of race conditions.
			// Imagine user changes category. If this watcher triggers before the category watcher,
			// the category watcher would remove every item and we'd end up with an empty map.
			if (items.value.entries().next().value?.[1]?.category !== appStateStore.selectedCategory) {
				items.value = new Map()
			}

			// loop over the items, remove the old ones, add the new ones
			getKeys(add).forEach(stashTabId => {
				add[stashTabId].forEach(poeItem => putItem(poeItem))
			})

			getKeys(remove).forEach(stashTabId => {
				remove[stashTabId].forEach(poeItem => deleteItem(poeItem))
			})

			items.value = new Map([...items.value.entries()].sort())
		})
	}

	/**
	 * Add the stack size of a PoeItem to its corresponding BulkyItem.
	 * If the BulkyItem does not exist yet, create it instead.
	 */
	function putItem(poeItem: PoeItem) {
		const base = BULKY_TRANSFORM.poeItemBaseTypeToBulkyTypeAndTier(poeItem, appStateStore.selectedCategory)
		if (!base) return

		const itemInMap = items.value.get(`${base.type}_${base.tier}`)

		// If this item exists already, only adjust the quantity...
		if (itemInMap) {
			itemInMap.quantity += poeItem.stackSize ?? 0
		}

		// ...otherwise, create a new BulkyItem and add it to the map
		else {
			const bulkyItem = BULKY_TRANSFORM.poeItemToBulkyItem(poeItem, appStateStore.selectedCategory, prices, priceOverrides)
			if (!bulkyItem) return
			items.value.set(`${bulkyItem.type}_${bulkyItem.tier}`, bulkyItem)
		}
	}

	/**
	 * Remove the stack size of a PoeItem from its corresponding BulkyItem.
	 * If the stack size is 0, remove the BulkyItem.
	 */
	function deleteItem(poeItem: PoeItem) {
		const base = BULKY_TRANSFORM.poeItemBaseTypeToBulkyTypeAndTier(poeItem, appStateStore.selectedCategory)
		if (!base) return false

		// Check if this item is in the map.
		const itemInMap = items.value.get(`${base.type}_${base.tier}`)

		if (itemInMap) {
			// Subtract this PoeItem's stack size from its corresponding BulkyItem.
			itemInMap.quantity -= poeItem.stackSize ?? 0

			// Remove the item from the map if its quantity is 0 or lower.
			if (itemInMap.quantity <= 0) {
				return items.value.delete(`${base.type}_${base.tier}`)
			}

			return true
		}

		return false
	}

	return { items }
}
