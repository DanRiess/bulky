import { BulkyItemRecord, BulkyPriceOverrideRecord } from '@shared/types/bulky.types'
import { PoeItemsByStash } from '@shared/types/poe.types'
import { getKeys, isWatchable } from '@shared/types/utility.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { MaybeRefOrGetter, Ref, ref, toValue, watch } from 'vue'

export function useBulkyItems(poeItems: MaybeRefOrGetter<PoeItemsByStash>, priceOverrides: Ref<BulkyPriceOverrideRecord>) {
	const appStateStore = useAppStateStore()

	const items = ref({}) as Ref<BulkyItemRecord>

	// Create a watcher that updates the items when stash selection changes.
	// Update here means fetching new tab's items from idb and deleting removed tab's items from the variable.
	// The comparison inside the watcher is only possible with a ComputedRef!
	if (isWatchable(poeItems)) {
		watch(poeItems, (newItems, oldItems) => {
			console.log('bulky watcher')
			console.log({ newItems, oldItems })
			const add = getKeys(newItems).reduce((prev, curr) => {
				prev[curr] = newItems[curr].filter(item => !oldItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)
			const remove = getKeys(oldItems).reduce((prev, curr) => {
				prev[curr] = oldItems[curr].filter(item => !newItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)

			console.log({ add, remove })

			// loop over the items, remove the old ones, add the new ones
		})
	}

	function initializeItems() {
		items.value = {}

		const nonRefItems = toValue(poeItems)

		getKeys(nonRefItems).map(stashTabId => {
			nonRefItems[stashTabId].forEach(poeItem => {
				const bulkyItem = BULKY_TRANSFORM.poeItemToBulkyItem(poeItem, appStateStore.selectedCategory)
				if (!bulkyItem) return

				if (!items.value[bulkyItem.type]) {
					items.value[bulkyItem.type] = [bulkyItem]
					return
				}

				const itemInArray = items.value[bulkyItem.type]!.find(i => i.tier === bulkyItem.tier)
			})
		})
	}

	return { items }
}
