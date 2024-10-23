/**
 * Handle catalyst filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { CatalystFilter, CatalystFilterField } from './catalyst.types'

export const useCatalystFilterStore = defineStore('catalystFilterStore', () => {
	const filters = ref<Map<CatalystFilter['uuid'], CatalystFilter>>(new Map())
	const currentFilterId = ref<CatalystFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/**
	 * Create a new filter.
	 */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<CatalystFilterField>>()
		const category = 'CATALYST'
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

	/**
	 * Add a filter field.
	 */
	function addFilterField(uuid: CatalystFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/**
	 * Remove a filter field.
	 */
	function removeFilterField(uuid: CatalystFilter['uuid'], idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/**
	 * Private function. Generate a default filter field.
	 *
	 * @private
	 */
	function generateDefaultFilterField() {
		const field: CatalystFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<CatalystFilterField>(),
			category: 'CATALYST',
			type: 'ABRASIVE_CATALYST',
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
	import.meta.hot.accept(acceptHMRUpdate(useCatalystFilterStore, import.meta.hot))
}
