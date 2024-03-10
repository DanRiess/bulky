import { Uuid, getKeys } from '@web/types/utitlity.types'
import { useEssenceFilterStore } from './essenceFilter.store'
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'
import { EssenceFilter } from './essence.types'

/**
 * Not really a composable, as it doesn't return reactive state.
 * It HAS to be wrapped in a computed property to be useful, but it can't be done here.
 * Reason is that this filter should be active when the category is Compass, otherwise another category's filter will be loaded.
 * The correct filter to be loaded needs to be computed elsewhere, which is why the computed prop needs to be there, not here.
 *
 * @example
 * const filterProps = computed(() => {
 * 		if (someCondition) return useCompassFilterProps()
 * })
 */
export function useEssenceFilterProps() {
	const essenceFilterStore = useEssenceFilterStore()

	const filter = essenceFilterStore.currentFilter

	if (!filter) {
		essenceFilterStore.createNewFilter()
	}

	if (!filter) return

	const mainOptions = getKeys(ESSENCE_TYPE)
	const secondaryOptions = getKeys(ESSENCE_TIER)

	function addFilterField(uuid: Uuid<EssenceFilter>) {
		essenceFilterStore.addFilterField(uuid)
	}

	function removeFilterField(uuid: Uuid<EssenceFilter>, idx: number) {
		essenceFilterStore.removeFilterField(uuid, idx)
	}

	return {
		filter,
		mainOptions,
		secondaryOptions,
		addFilterField,
		removeFilterField,
	}
}
