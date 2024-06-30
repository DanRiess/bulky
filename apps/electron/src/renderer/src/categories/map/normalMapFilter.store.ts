/**
 * Handle essence filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { MapFilter, MapFilterField } from './map.types'

export const useNormalMapFilterStore = defineStore('normalMapFilterStore', () => {
	const filters = ref<Map<MapFilter['uuid'], MapFilter>>(new Map())
	const currentFilterId = ref<MapFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/** create a new filter */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<MapFilterField>>()
		const category = 'MAP'
		const name = `Default_${filters.value.size}`
		const fullBuyout = false
		const alwaysMaxQuantity = false
		const multiplier = 2

		filters.value.set(uuid, {
			uuid,
			category,
			name,
			fullBuyout,
			multiplier,
			alwaysMaxQuantity,
			fields: [generateDefaultFilterField()],
		})

		currentFilterId.value = uuid

		return uuid
	}

	/** add a filter field */
	function addFilterField(uuid: MapFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/** remove a filter field */
	function removeFilterField(uuid: MapFilter['uuid'], idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/** Private function. Generate a default filter field */
	function generateDefaultFilterField() {
		const field: MapFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<MapFilterField>(),
			category: 'MAP',
			type: 'JUNGLE_VALLEY',
			tier: 'TIER_16',
			quantity: 1,
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
	import.meta.hot.accept(acceptHMRUpdate(useNormalMapFilterStore, import.meta.hot))
}
