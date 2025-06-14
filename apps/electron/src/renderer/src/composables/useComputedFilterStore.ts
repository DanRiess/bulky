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
import { useBestiaryFilterStore } from '@web/categories/bestiary/bestiaryFilter.store'
import { useDelveFilterStore } from '@web/categories/delve/delveFilter.store'
import { useCatalystFilterStore } from '@web/categories/catalyst/catalystFilter.store'
import { useCurrencyFilterStore } from '@web/categories/currency/currencyFilter.store'
import { useHeistFilterStore } from '@web/categories/heist/heistFilter.store'
import { useExpeditionFilterStore } from '@web/categories/expedition/expeditionFilter.store'
import { useFragmentFilterStore } from '@web/categories/fragment/fragmentFilter.store'

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
	const bestiaryFilterStore = useBestiaryFilterStore()
	const delveFilterStore = useDelveFilterStore()
	const catalystFilterStore = useCatalystFilterStore()
	const currencyFilterStore = useCurrencyFilterStore()
	const heistFilterStore = useHeistFilterStore()
	const expeditionFilterStore = useExpeditionFilterStore()
	const fragmentFilterStore = useFragmentFilterStore()

	return computed<ComputedBulkyFilterStore | undefined>(() => {
		const store = BULKY_FACTORY.getFilterStore(appStateStore.selectedCategory)
		if (!store) return

		// If there is no filter yet, create one and use it.
		let filter = store.currentFilter
		if (!filter) {
			const id = store.createNewFilter()

			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(id)) filter = store.filters.get(id)
			else if (store === scarabFilterStore && BULKY_UUID.isScarabFilterUuid(id)) filter = store.filters.get(id)
			else if (store === deliriumOrbFilterStore && BULKY_UUID.isDeliriumOrbFilterUuid(id)) filter = store.filters.get(id)
			else if (store === normalMapFilterStore && BULKY_UUID.isMapFilterUuid(id)) filter = store.filters.get(id)
			else if (store === map8ModFilterStore && BULKY_UUID.isMap8ModFilterUuid(id)) filter = store.filters.get(id)
			else if (store === bestiaryFilterStore && BULKY_UUID.isBestiaryFilterUuid(id)) filter = store.filters.get(id)
			else if (store === delveFilterStore && BULKY_UUID.isDelveFilterUuid(id)) filter = store.filters.get(id)
			else if (store === catalystFilterStore && BULKY_UUID.isCatalystFilterUuid(id)) filter = store.filters.get(id)
			else if (store === currencyFilterStore && BULKY_UUID.isCurrencyFilterUuid(id)) filter = store.filters.get(id)
			else if (store === heistFilterStore && BULKY_UUID.isHeistFilterUuid(id)) filter = store.filters.get(id)
			else if (store === expeditionFilterStore && BULKY_UUID.isExpeditionFilterUuid(id)) filter = store.filters.get(id)
			else if (store === fragmentFilterStore && BULKY_UUID.isFragmentFilterUuid(id)) filter = store.filters.get(id)
		}

		// If something went wrong during filter creation, return.
		if (!filter) return

		// Extra for fragment category:
		// Check if user has selected the full sets option.
		// In this case, return the sets as type options, not the individual items.
		const secondaryOption = filter.category === 'FRAGMENT' && filter.fullSets

		const filterFieldTypeOptions = BULKY_FACTORY.getItemTypes(appStateStore.selectedCategory, secondaryOption)
		const filterFieldTierOptions = BULKY_FACTORY.getItemTiers(appStateStore.selectedCategory)

		// Return if something went wrong with the variable assignments.
		if (!filterFieldTypeOptions || !filterFieldTierOptions) return

		/** Add a new filter field to the current filter */
		function addFilterField(uuid: Uuid<BulkyFilter>) {
			if (!store) return

			// Assert that store and uuid type are compatible.
			// Only necessary because I suck at using ts generics. There must be a better way..
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === scarabFilterStore && BULKY_UUID.isScarabFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === deliriumOrbFilterStore && BULKY_UUID.isDeliriumOrbFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === normalMapFilterStore && BULKY_UUID.isMapFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === map8ModFilterStore && BULKY_UUID.isMap8ModFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === bestiaryFilterStore && BULKY_UUID.isBestiaryFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === delveFilterStore && BULKY_UUID.isDelveFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === catalystFilterStore && BULKY_UUID.isCatalystFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === currencyFilterStore && BULKY_UUID.isCurrencyFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === heistFilterStore && BULKY_UUID.isHeistFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === expeditionFilterStore && BULKY_UUID.isExpeditionFilterUuid(uuid)) store.addFilterField(uuid)
			else if (store === fragmentFilterStore && BULKY_UUID.isFragmentFilterUuid(uuid)) store.addFilterField(uuid)
		}

		/** Remove a filter field from the current filter */
		function removeFilterField(uuid: Uuid<BulkyFilter>, idx: number) {
			if (!store) return

			// Assert that store and uuid type are compatible.
			// Only necessary because I suck at using ts generics. There must be a better way..
			if (store === essenceFilterStore && BULKY_UUID.isEssenceFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === scarabFilterStore && BULKY_UUID.isScarabFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === deliriumOrbFilterStore && BULKY_UUID.isDeliriumOrbFilterUuid(uuid))
				store.removeFilterField(uuid, idx)
			else if (store === normalMapFilterStore && BULKY_UUID.isMapFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === map8ModFilterStore && BULKY_UUID.isMap8ModFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === bestiaryFilterStore && BULKY_UUID.isBestiaryFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === delveFilterStore && BULKY_UUID.isDelveFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === catalystFilterStore && BULKY_UUID.isCatalystFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === currencyFilterStore && BULKY_UUID.isCurrencyFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === heistFilterStore && BULKY_UUID.isHeistFilterUuid(uuid)) store.removeFilterField(uuid, idx)
			else if (store === expeditionFilterStore && BULKY_UUID.isExpeditionFilterUuid(uuid))
				store.removeFilterField(uuid, idx)
			else if (store === fragmentFilterStore && BULKY_UUID.isFragmentFilterUuid(uuid)) store.removeFilterField(uuid, idx)
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
