/** handle compass filters logic in this store */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { ScarabFilter, ScarabFilterField } from './scarab.types'

export const useScarabFilterStore = defineStore('scarabFilterStore', () => {
	const filters = ref<Map<ScarabFilter['uuid'], ScarabFilter>>(new Map())
	const currentFilterId = ref<ScarabFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/**
	 * Create a new filter.
	 */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<ScarabFilterField>>()
		const category = 'SCARAB'
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
	function addFilterField(uuid: ScarabFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/**
	 * Remove a filter field.
	 */
	function removeFilterField(uuid: ScarabFilter['uuid'], idx: number) {
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
		const field: ScarabFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<ScarabFilterField>(),
			category: 'SCARAB',
			type: 'RELIQUARY_SCARAB',
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
	import.meta.hot.accept(acceptHMRUpdate(useScarabFilterStore, import.meta.hot))
}
