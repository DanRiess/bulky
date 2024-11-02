/**
 * Handle expedition filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { ExpeditionFilter, ExpeditionFilterField } from './expedition.types'

export const useExpeditionFilterStore = defineStore('expeditionFilterStore', () => {
	const filters = ref<Map<ExpeditionFilter['uuid'], ExpeditionFilter>>(new Map())
	const currentFilterId = ref<ExpeditionFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/**
	 * Create a new filter.
	 */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<ExpeditionFilterField>>()
		const category = 'EXPEDITION'
		const name = `Default_${filters.value.size}`
		const fullBuyout = false
		const alwaysMaxQuantity = false

		filters.value.set(uuid, {
			uuid,
			category,
			name,
			fullBuyout,
			alwaysMaxQuantity,
			fields: [generateDefaultFilterField()],
		})

		currentFilterId.value = uuid

		return uuid
	}

	/**
	 * Add a filter field.
	 */
	function addFilterField(uuid: ExpeditionFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/**
	 * Remove a filter field.
	 */
	function removeFilterField(uuid: ExpeditionFilter['uuid'], idx: number) {
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
		const field: ExpeditionFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<ExpeditionFilterField>(),
			category: 'EXPEDITION',
			type: 'LOGBOOK_BLACK_SCYTHE_MERCENARIES',
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
	import.meta.hot.accept(acceptHMRUpdate(useExpeditionFilterStore, import.meta.hot))
}
