import { BulkyItem, BulkyPriceOverrideItem, BulkyPriceOverrideRecord, Category } from '@shared/types/bulky.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { Ref, ref, watch } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { BULKY_TRANSFORM } from '@web/utility/transformers'

/**
 * This function returns a ref that holds the current category's price overrides.
 * Price overrides are saved in the price_override store in the idb.
 */
export function usePriceOverride() {
	const appStateStore = useAppStateStore()

	const priceOverrides: Ref<BulkyPriceOverrideRecord> = ref({})

	// Load the current category's prices whenever the category changes.
	watch(
		() => appStateStore.selectedCategory,
		category => {
			updateStateVariable(category).then(state => {
				priceOverrides.value = state
			})
		},
		{ immediate: true }
	)

	/**
	 * Edit or add a price override
	 */
	function editPriceOverride(item: BulkyItem) {
		const bulkyIdb = useBulkyIdb()

		const newItem = BULKY_TRANSFORM.bulkyItemToPriceOverrideItem(item)

		// override does not exist in the state variable yet
		if (!priceOverrides.value[item.type]) {
			priceOverrides.value[item.type] = [newItem]
		}

		// override does exist, find the correct tier in the array
		else {
			let existingItem = priceOverrides.value[item.type]!.find(override => override.tier === item.tier)

			existingItem
				? (existingItem.priceOverride = item.priceOverride)
				: priceOverrides.value[item.type]!.push(BULKY_TRANSFORM.bulkyItemToPriceOverrideItem(item))
		}

		// put the new item in the database
		bulkyIdb.putPriceOverride(newItem)
	}

	return { priceOverrides, editPriceOverride }
}

// LOCAL API

/**
 * Load the current category's prices from idb.
 */
async function updateStateVariable(category: Category) {
	const bulkyIdb = useBulkyIdb()

	// Get overrides for this category from idb.
	const overrides = await bulkyIdb.getPriceOverrideByCategory(category)

	// Transform the overrides into the form expected by the state variable
	return transformOverridesToState(overrides)
}

/**
 * Transform a price override item to the form expected by the state variable.
 */
function transformOverridesToState(overrides: BulkyPriceOverrideItem[]): BulkyPriceOverrideRecord {
	const state = {} as BulkyPriceOverrideRecord

	overrides.reduce((prevState, currItem) => {
		if (!prevState[currItem.type]) {
			prevState[currItem.type] = []
		}

		prevState[currItem.type]?.push(currItem)
		return prevState
	}, state)

	return state
}
