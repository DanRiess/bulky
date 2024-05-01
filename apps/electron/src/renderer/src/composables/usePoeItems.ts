import { PoeItem } from '@shared/types/poe.types'
import { StashTab } from '@shared/types/stash.types'
import { isWatchable } from '@shared/types/utility.types'
import { MaybeRefOrGetter, ref, watch } from 'vue'

export function usePoeItems(stashTabs: MaybeRefOrGetter<StashTab[]>) {
	const items = ref<{ [key: StashTab['id']]: PoeItem[] }>({})

	// save items to indexeddb with index of stashtabid, so they can be easily grabbed
	// save them in this 'items' structure as {stashtabid: poeitem[]}
	// in the filter step later, this should be reduced to a pure poeitem[] where
	// identical entries from different folders would be combined

	// get items from indexeddb by stashid

	// create a watcher that updates the items
	// the comparison inside the watcher is only possible with a ComputedRef!
	if (isWatchable(stashTabs)) {
		watch(stashTabs, (newTabs, oldTabs) => {
			// compare which tabs have been added and which have been removed
			const remove = oldTabs.filter(val => !newTabs.includes(val))
			const add = newTabs.filter(val => !oldTabs.includes(val))
			console.log({ remove, add })

			// remove necessary items (items[id].length = 0)
			remove.forEach(tab => items.value[tab.id] && (items.value[tab.id].length = 0))

			// get new tabs' items from indexeddb
			add.forEach(tab => (items.value[tab.id] = []))
		})
	}

	return { items }
}
