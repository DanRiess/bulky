/**
 * Handle bestiary filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { BestiaryFilter, BestiaryFilterField } from './bestiary.type'

export const useBestiaryFilterStore = defineStore('bestiaryFilterStore', () => {
	const filters = ref<Map<BestiaryFilter['uuid'], BestiaryFilter>>(new Map())
	const currentFilterId = ref<BestiaryFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/** create a new filter */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<BestiaryFilterField>>()
		const category = 'BESTIARY'
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
	function addFilterField(uuid: BestiaryFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/** remove a filter field */
	function removeFilterField(uuid: BestiaryFilter['uuid'], idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/** Private function. Generate a default filter field */
	function generateDefaultFilterField() {
		const field: BestiaryFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<BestiaryFilterField>(),
			category: 'BESTIARY',
			type: 'BLACK_MÓRRIGAN',
			tier: '0',
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
	import.meta.hot.accept(acceptHMRUpdate(useBestiaryFilterStore, import.meta.hot))
}
