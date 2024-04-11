import { computed } from 'vue'
import { Uuid, getKeys } from '@shared/types/utility.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { AnyFilter, Filter, FilterMainOption, FilterSecondaryOption, GenericFilterStore } from '@shared/types/bulky.types'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useCompassFilterStore } from '@web/categories/compass/compassFilter.store'
import { SEXTANT_MODIFIER, SEXTANT_TYPE } from '@web/categories/compass/compass.const'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { ESSENCE_TIER, ESSENCE_TYPE } from '@web/categories/essence/essence.const'

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useFilterProps() {
	const appStateStore = useAppStateStore()
	const compassFilterStore = useCompassFilterStore()
	const essenceFilterStore = useEssenceFilterStore()

	return computed(() => {
		let store: GenericFilterStore | undefined
		let filter: AnyFilter | undefined
		let mainOptions: FilterMainOption[] | undefined
		let secondaryOptions: FilterSecondaryOption[] | undefined

		if (appStateStore.selectedCategory === 'COMPASS') {
			store = compassFilterStore
			filter = compassFilterStore.currentFilter
			mainOptions = getKeys(SEXTANT_MODIFIER)
			secondaryOptions = getKeys(SEXTANT_TYPE)
		} else if (appStateStore.selectedCategory === 'ESSENCE') {
			store = essenceFilterStore
			filter = essenceFilterStore.currentFilter
			mainOptions = getKeys(ESSENCE_TYPE)
			secondaryOptions = getKeys(ESSENCE_TIER)
		}

		// return if something went wrong with the variable assignments
		if (!store || !mainOptions || !secondaryOptions) return

		// if there is no filter yet, create one
		if (!filter) {
			store.createNewFilter()
		}

		// if there's still no filter, return
		if (!filter) return

		/** Add a new filter field to the current filter */
		function addFilterField<T extends Filter>(uuid: Uuid<T>) {
			if (!store) return

			// assert that store and uuid type are compatible
			if (store === compassFilterStore && BULKY_UUID.isCompassFilterUuid(uuid)) store.addFilterField(uuid)
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.addFilterField(uuid)
		}

		/** Remove a filter field from the current filter */
		function removeFilterField<T extends Filter>(uuid: Uuid<T>, idx: number) {
			if (!store) return

			// assert that store and uuid type are compatible
			if (store === compassFilterStore && BULKY_UUID.isCompassFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.removeFilterField(uuid, idx)
		}

		return {
			filter,
			mainOptions,
			secondaryOptions,
			addFilterField,
			removeFilterField,
		}
	})
}
