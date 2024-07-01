import { ApiStatus } from '@web/api/api.types'
import { poeApi } from '@web/api/poeApi'
import { createNormalisedApiStatuses, useApi } from '@web/api/useApi'
import { MaybeRefOrGetter, ref, toValue } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { PoeItemsByStash, PoeStashTab } from '@shared/types/poe.types'

/**
 * Fetch items from the passed stash tabs. If 'stashTabs' is a ref/computed,
 * calling the 'execute' function will use the reactive values as well.
 */
export function useFetchStashItems(stashTabs: MaybeRefOrGetter<PoeStashTab[]>) {
	const bulkyIdb = useBulkyIdb()
	const status = ref<ApiStatus>('IDLE')
	const data = ref<PoeItemsByStash>()
	const error = ref<Error>()

	/**
	 * Fetch all selected stash tabs, update the tab's snapshot, and save it to idb.
	 * The data will be transformed to the Bulky format and saved to idb as well.
	 */
	async function execute() {
		status.value = 'PENDING'

		await Promise.allSettled(
			toValue(stashTabs).map(async tab => {
				// Block the request if the tab synchronized less than 30 seconds ago.
				if (Date.now() - tab.lastSnapshot < 30000) {
					status.value = 'SUCCESS'
					return
				}

				const request = useApi(`${tab.id}ItemRequest`, poeApi.getStashTabItems)
				await request.exec(tab)

				console.log('before handle')

				if (request.error.value || !request.data.value) {
					console.log('error')
					status.value = 'ERROR'
					error.value = request.error.value
					return
				}

				console.log(status.value)

				if (status.value !== 'ERROR') {
					console.log('should change')
					status.value = 'SUCCESS'
				}

				// Map stashes return a different payload than other stash tabs.
				// Instead of 'items', it has 'children'. Each child is a stash tab on its own,
				// but it has enough metadata to turn it into a PoeItem without explicitly requesting its data.
				const poeItems =
					tab.type === 'MapStash'
						? request.data.value.stash.children
								?.map(mapSubStash => BULKY_TRANSFORM.mapSubStashToPoeItem(mapSubStash))
								.filter(Boolean)
						: request.data.value.stash.items.map(poeItem => BULKY_TRANSFORM.itemDtoToPoeItem(poeItem, tab))

				if (!poeItems) return

				// Save the transformed items to the data object.
				data.value ? (data.value[tab.id] = poeItems) : (data.value = { [tab.id]: poeItems })

				// update the snapshot time and save it to idb
				tab.lastSnapshot = Date.now()
				await bulkyIdb.putStashTabs([tab])
			})
		)
	}

	return { execute, status, data, error, ...createNormalisedApiStatuses(status) }
}
