import { BulkyItemsByStash } from '@shared/types/bulky.types'
import { StashTab } from '@shared/types/stash.types'
import { ApiStatus } from '@web/api/api.types'
import { poeApi } from '@web/api/poeApi'
import { createNormalisedApiStatuses, useApi } from '@web/api/useApi'
import { MaybeRefOrGetter, ref, toValue } from 'vue'
import { transformPoeItemToBulkyItem } from '../utility/transformers'
import { useBulkyIdb } from './useBulkyIdb'

/**
 * Fetch items from the passed stash tabs. If 'stashTabs' is a ref/computed,
 * calling the 'execute' function will use the reactive values as well.
 */
export function useFetchStashItems(stashTabs: MaybeRefOrGetter<StashTab[]>) {
	const bulkyIdb = useBulkyIdb()
	const status = ref<ApiStatus>('IDLE')
	const data = ref<BulkyItemsByStash>()
	const error = ref<Error>()

	/**
	 * Fetch all selected stash tabs, update the tab's snapshot, and save it to idb.
	 * The data will be transformed to the Bulky format and saved to idb as well.
	 */
	async function execute() {
		status.value = 'PENDING'

		await Promise.allSettled(
			toValue(stashTabs).map(async tab => {
				const request = useApi(`${tab.id}ItemRequest`, poeApi.getStashTabItems)
				await request.exec(tab)

				if (request.error.value || !request.data.value) {
					status.value = 'ERROR'
					error.value = request.error.value
					return
				}

				if (status.value !== 'ERROR') {
					status.value = 'SUCCESS'
				}

				// Convert dto to BulkyItem.
				const bulkyItems = request.data.value.stash.items.map(poeItem => transformPoeItemToBulkyItem(poeItem, tab))

				// Save the transformed items to the data object.
				data.value ? (data.value[tab.id] = bulkyItems) : (data.value = { [tab.id]: bulkyItems })

				// update the snapshot time and save it to idb
				tab.lastSnapshot = Date.now()
				await bulkyIdb.putStashTabs([tab])
			})
		)
	}

	return { execute, status, data, error, ...createNormalisedApiStatuses(status) }
}
