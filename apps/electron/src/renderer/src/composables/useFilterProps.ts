import { computed } from 'vue'
import { Uuid, getKeys } from '@shared/types/utility.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter, BulkyFilterField, BulkyFilterStore } from '@shared/types/bulky.types'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { ESSENCE_TIER, ESSENCE_TYPE } from '@web/categories/essence/essence.const'

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useFilterProps() {
	const appStateStore = useAppStateStore()
	const essenceFilterStore = useEssenceFilterStore()

	return computed(() => {
		let store: BulkyFilterStore | undefined
		let filter: BulkyFilter | undefined
		let filterFieldTypeOptions: BulkyFilterField['type'][] | undefined
		let filterFieldTierOptions: BulkyFilterField['tier'][] | undefined

		if (appStateStore.selectedCategory === 'ESSENCE') {
			store = essenceFilterStore
			filter = essenceFilterStore.currentFilter
			filterFieldTypeOptions = getKeys(ESSENCE_TYPE)
			filterFieldTierOptions = getKeys(ESSENCE_TIER)
		}

		// return if something went wrong with the variable assignments
		if (!store || !filterFieldTypeOptions || !filterFieldTierOptions) return

		// if there is no filter yet, create one
		if (!filter) {
			store.createNewFilter()
		}

		// if there's still no filter, return
		if (!filter) return

		/** Add a new filter field to the current filter */
		function addFilterField<T extends BulkyFilter>(uuid: Uuid<T>) {
			if (!store) return

			// assert that store and uuid type are compatible
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.addFilterField(uuid)
		}

		/** Remove a filter field from the current filter */
		function removeFilterField<T extends BulkyFilter>(uuid: Uuid<T>, idx: number) {
			if (!store) return

			// assert that store and uuid type are compatible
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.removeFilterField(uuid, idx)
		}

		return {
			filter,
			filterFieldTypeOptions,
			filterFieldTierOptions,
			addFilterField,
			removeFilterField,
		}
	})
}
