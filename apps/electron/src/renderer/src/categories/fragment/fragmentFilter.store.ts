/**
 * Handle fragment filter logic in this store.
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter } from '@shared/types/bulky.types'
import { FragmentFilter, FragmentFilterField } from './fragment.types'

export const useFragmentFilterStore = defineStore('fragmentFilterStore', () => {
	const filters = ref<Map<FragmentFilter['uuid'], FragmentFilter>>(new Map())
	const currentFilterId = ref<FragmentFilter['uuid']>()
	const currentFilter = computed(() => {
		return currentFilterId.value ? filters.value.get(currentFilterId.value) : undefined
	})

	/**
	 * Create a new filter.
	 */
	function createNewFilter() {
		const uuid = BULKY_UUID.generateTypedUuid<BulkyFilter<FragmentFilterField>>()
		const category = 'FRAGMENT'
		const name = `Default_${filters.value.size}`
		const fullBuyout = false
		const alwaysMaxQuantity = false
		const multiplier = 2
		const fullSets = false

		// Specific to this category:
		// Keep filter fields for individual items and sets in their own variables to allow seamless switching.
		const individualItemFields = [generateDefaultFilterField()]
		const setItemFields = [generateDefaultFilterField(true)]

		filters.value.set(uuid, {
			uuid,
			category,
			name,
			fullBuyout,
			multiplier,
			alwaysMaxQuantity,
			fullSets,
			fields: individualItemFields,
			individualFields: individualItemFields,
			setFields: setItemFields,
		})

		// Create a computed property for the fullSets property to watch.
		const fullSetsValue = computed(() => filters.value.get(uuid)?.fullSets)

		watch(fullSetsValue, fullSets => {
			if (fullSets === undefined) return

			const filter = filters.value.get(uuid)
			if (!filter) return

			if (filter.fullSets && filter.setFields) {
				filter.fields = filter.setFields
			} else if (filter.fullSets === false && filter.individualFields) {
				filter.fields = filter.individualFields
			}
		})

		currentFilterId.value = uuid

		return uuid
	}

	/**
	 * Add a filter field.
	 */
	function addFilterField(uuid: FragmentFilter['uuid']) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.push(generateDefaultFilterField(filter.fullSets))
	}

	/**
	 * Remove a filter field.
	 */
	function removeFilterField(uuid: FragmentFilter['uuid'], idx: number) {
		const filter = filters.value.get(uuid)
		if (!filter) return

		filter.fields.splice(idx, 1)
	}

	/**
	 * Private function. Generate a default filter field.
	 *
	 * @private
	 */
	function generateDefaultFilterField(secondaryTypeOption = false) {
		const type = secondaryTypeOption ? 'ADORNED' : "AL-HEZMIN'S_CREST"

		const field: FragmentFilterField = {
			uuid: BULKY_UUID.generateTypedUuid<FragmentFilterField>(),
			category: 'FRAGMENT',
			type,
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
	import.meta.hot.accept(acceptHMRUpdate(useFragmentFilterStore, import.meta.hot))
}
