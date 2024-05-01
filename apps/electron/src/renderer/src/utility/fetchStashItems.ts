import { PoeItem } from '@shared/types/poe.types'
import { StashTab } from '@shared/types/stash.types'
import { ApiStatus } from '@web/api/api.types'
import { poeApi } from '@web/api/poeApi'
import { createNormalisedApiStatuses, useApi } from '@web/api/useApi'
import { ref } from 'vue'

export function useFetchStashItems(stashTabs: StashTab[]) {
	const status = ref<ApiStatus>('IDLE')
	const data = ref<{ [key: StashTab['id']]: PoeItem[] }>({})
	const error = ref<Error>()

	async function execute() {
		status.value = 'PENDING'

		await Promise.allSettled(
			stashTabs.map(async tab => {
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

				data.value[tab.id] = request.data.value
			})
		)
	}

	return { execute, status, data, error, ...createNormalisedApiStatuses(status) }
}
