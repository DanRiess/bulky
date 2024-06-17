import { ApiStatus } from '@web/api/api.types'
import { poeApi } from '@web/api/poeApi'
import { createNormalisedApiStatuses, useApi } from '@web/api/useApi'
import { MaybeRefOrGetter, ref, toValue } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { generatePoeItemFromDto } from '@web/utility/transformers'
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
				if (Date.now() - tab.lastSnapshot < 30000) return

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

				// Convert dto to PoeItem.
				const poeItems = request.data.value.stash.items.map(poeItem => generatePoeItemFromDto(poeItem, tab))

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
