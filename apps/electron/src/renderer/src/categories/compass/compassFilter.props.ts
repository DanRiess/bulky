import { useCompassFilterStore } from './compassFilter.store'
import { Uuid, getKeys } from '@web/types/utitlity.types'
import { AnyFilter } from '@web/types/bulky.types'
import { SEXTANT_MODIFIER, SEXTANT_TYPE } from './compass.const'

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
export function useCompassFilterProps() {
	const compassFilterStore = useCompassFilterStore()

	const filter = compassFilterStore.currentFilter

	if (!filter) {
		compassFilterStore.createNewFilter()
	}

	if (!filter) return

	const mainOptions = getKeys(SEXTANT_MODIFIER)
	const secondaryOptions = getKeys(SEXTANT_TYPE)

	function addFilterField(uuid: Uuid<AnyFilter>) {
		compassFilterStore.addFilterField(uuid)
	}

	function removeFilterField(uuid: Uuid<AnyFilter>, idx: number) {
		compassFilterStore.removeFilterField(uuid, idx)
	}

	return {
		filter,
		mainOptions,
		secondaryOptions,
		addFilterField,
		removeFilterField,
	}
}
