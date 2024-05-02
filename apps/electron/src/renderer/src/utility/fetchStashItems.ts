import { BulkyItem } from '@shared/types/bulky.types'
import { StashTab } from '@shared/types/stash.types'
import { ApiStatus } from '@web/api/api.types'
import { poeApi } from '@web/api/poeApi'
import { createNormalisedApiStatuses, useApi } from '@web/api/useApi'
import { MaybeRefOrGetter, ref, toValue } from 'vue'
import { transformPoeItemToBulkyItem } from './transformers'

export function useFetchStashItems(stashTabs: MaybeRefOrGetter<StashTab[]>) {
	const status = ref<ApiStatus>('IDLE')
	const data = ref<{ [key: StashTab['id']]: BulkyItem[] }>({})
	const error = ref<Error>()

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

				// convert dto to BulkyItem first
				const bulkyItems = request.data.value.stash.items.map(poeItem => transformPoeItemToBulkyItem(poeItem))

				data.value[tab.id] = bulkyItems
			})
		)
	}

	return { execute, status, data, error, ...createNormalisedApiStatuses(status) }
}
