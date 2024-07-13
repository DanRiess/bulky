import { computed } from 'vue'
import { Uuid } from '@shared/types/utility.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { BulkyFilter, ComputedBulkyFilterStore } from '@shared/types/bulky.types'

import { useAppStateStore } from '@web/stores/appStateStore'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { BULKY_FACTORY } from '@web/utility/factory'
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'
import { useNormalMapFilterStore } from '@web/categories/map/normalMapFilter.store'
import { useMap8ModFilterStore } from '@web/categories/map/map8ModFilter.store'

/**
 * Returns a computed list of display values depending on what category is chosen and its current filter.
 */
export function useComputedFilterStore() {
	const appStateStore = useAppStateStore()
	const essenceFilterStore = useEssenceFilterStore()
	const scarabFilterStore = useScarabFilterStore()
	const deliriumOrbFilterStore = useDeliriumOrbFilterStore()
	const normalMapFilterStore = useNormalMapFilterStore()
	const map8ModFilterStore = useMap8ModFilterStore()

	return computed<ComputedBulkyFilterStore | undefined>(() => {
		const store = BULKY_FACTORY.getFilterStore(appStateStore.selectedCategory)
		const filterFieldTypeOptions = BULKY_FACTORY.getItemTypes(appStateStore.selectedCategory)
		const filterFieldTierOptions = BULKY_FACTORY.getItemTiers(appStateStore.selectedCategory)

		// Return if something went wrong with the variable assignments.
		if (!store || !filterFieldTypeOptions || !filterFieldTierOptions) return

		// If there is no filter yet, create one and use it.
		let filter = store.currentFilter
		if (!filter) {
			const id = store.createNewFilter()
			filter = store.filters.get(id)
		}

		// If something went wrong during filter creation, return.
		if (!filter) return

		/** Add a new filter field to the current filter */
		function addFilterField<T extends BulkyFilter>(uuid: Uuid<T>) {
			if (!store) return

			// Assert that store and uuid type are compatible.
			// Only necessary because I suck at using ts generics. There must be a better way..
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === scarabFilterStore && BULKY_UUID.isScarabFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === deliriumOrbFilterStore && BULKY_UUID.isDeliriumOrbFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === normalMapFilterStore && BULKY_UUID.isMapFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === map8ModFilterStore && BULKY_UUID.isMap8ModFilterUuid(uuid)) store.addFilterField(uuid)
		}

		/** Remove a filter field from the current filter */
		function removeFilterField<T extends BulkyFilter>(uuid: Uuid<T>, idx: number) {
			if (!store) return

			// Assert that store and uuid type are compatible.
			// Only necessary because I suck at using ts generics. There must be a better way..
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === scarabFilterStore && BULKY_UUID.isScarabFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === deliriumOrbFilterStore && BULKY_UUID.isDeliriumOrbFilterUuid(uuid))
				store.removeFilterField(uuid, idx)
			else if (store === normalMapFilterStore && BULKY_UUID.isMapFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === map8ModFilterStore && BULKY_UUID.isMap8ModFilterUuid(uuid)) store.removeFilterField(uuid, idx)
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
