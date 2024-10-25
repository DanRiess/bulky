/**
 * Handle heist filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { HeistFilter, HeistFilterField } from './heist.types'

export const useHeistFilterStore = defineStore('heistFilterStore', () => {
	const filters = ref<Map<HeistFilter['uuid'], HeistFilter>>(new Map())
	const currentFilterId = ref<HeistFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/**
	 * Create a new filter.
	 */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<HeistFilterField>>()
		const category = 'HEIST'
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
	function addFilterField(uuid: HeistFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/**
	 * Remove a filter field.
	 */
	function removeFilterField(uuid: HeistFilter['uuid'], idx: number) {
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
		const field: HeistFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<HeistFilterField>(),
			category: 'HEIST',
			type: 'BLUEPRINT',
			tier: 'ILVL_83+',
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
	import.meta.hot.accept(acceptHMRUpdate(useHeistFilterStore, import.meta.hot))
}
