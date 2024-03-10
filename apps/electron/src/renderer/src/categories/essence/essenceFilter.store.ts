/** handle compass filters logic in this store */

import { Uuid } from '@web/types/utitlity.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { EssenceFilter, EssenceFilterField, EssenceFilters } from './essence.types'

export const useEssenceFilterStore = defineStore('essenceFilterStore', () => {
	const filters = ref<EssenceFilters>(new Map())
	const currentFilterId = ref<Uuid<EssenceFilter>>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/** create a new filter */
	function createNewFilter() {
		console.log('new essence filter')
		const uuid = BULKY_UUID.generateTypedUuid<EssenceFilter>()
		const name = `Default_${filters.value.size}`
		const fullBuyout = false
		const alwaysMaxQuantity = false
		const multiplier = 2

		filters.value.set(uuid, { uuid, name, fullBuyout, multiplier, alwaysMaxQuantity, fields: [generateDefaultFilterField()] })

		currentFilterId.value = uuid

		return uuid
	}

	/** add a filter field */
	function addFilterField(uuid: Uuid<EssenceFilter>) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField())
	}

	/** remove a filter field */
	function removeFilterField(uuid: Uuid<EssenceFilter>, idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/** Private function. Generate a default filter field */
	function generateDefaultFilterField() {
		const field: EssenceFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<EssenceFilterField>(),
			mainOption: 'ANGER',
			secondaryOption: 'DEAFENING',
			quantity: 1,
			maxBuyout: 0,
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
	import.meta.hot.accept(acceptHMRUpdate(useEssenceFilterStore, import.meta.hot))
}
