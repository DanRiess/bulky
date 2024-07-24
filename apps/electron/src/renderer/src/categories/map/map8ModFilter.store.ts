/**
 * Handle essence filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { Map8ModFilter, Map8ModFilterField } from './map.types'

export const useMap8ModFilterStore = defineStore('Map8ModFilterStore', () => {
	const filters = ref<Map<Map8ModFilter['uuid'], Map8ModFilter>>(new Map())
	const currentFilterId = ref<Map8ModFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/** create a new filter */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<Map8ModFilterField>>()
		const category = 'MAP_8_MOD'
		const name = `Default_${filters.value.size}`
		const alwaysMaxQuantity = false
		const regex = ''

		filters.value.set(uuid, {
			uuid,
			category,
			name,
			alwaysMaxQuantity,
			regex,
			fields: [generateDefaultFilterField()],
		})

		currentFilterId.value = uuid

		return uuid
	}

	/** add a filter field */
	function addFilterField(uuid: Map8ModFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/** remove a filter field */
	function removeFilterField(uuid: Map8ModFilter['uuid'], idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/** Private function. Generate a default filter field */
	function generateDefaultFilterField() {
		const field: Map8ModFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<Map8ModFilterField>(),
			category: 'MAP_8_MOD',
			type: 'BASILICA',
			tier: 'TIER_14',
			quantity: 1,
			options: {
				regex: '',
			},
		}
		return field
	}

	return {
		filters,
		currentFilter,
		createNewFilter,
		addFilterField,
		removeFilterField,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMap8ModFilterStore, import.meta.hot))
}
