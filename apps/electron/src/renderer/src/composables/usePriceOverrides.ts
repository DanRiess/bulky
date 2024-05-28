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

	const priceOverrides: Ref<BulkyPriceOverrideRecord> = ref(new Map())

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
	 * Edit or add a price override.
	 * Pass the new price as explicit parameter, since on the BulkyItem,
	 * the price override is computed only.
	 */
	function putPriceOverride(item: BulkyItem, price: number) {
		const bulkyIdb = useBulkyIdb()

		// generate the new override item
		const newItem = BULKY_TRANSFORM.bulkyItemToPriceOverrideItem(item, price)

		// set the new item in the map
		priceOverrides.value.set(`${newItem.type}_${newItem.tier}`, newItem)

		// put the new item in the database
		bulkyIdb.putPriceOverride(newItem)
	}

	return { priceOverrides, putPriceOverride }
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
	const state = new Map() as BulkyPriceOverrideRecord

	overrides.reduce((prevState, currItem) => {
		prevState.set(`${currItem.type}_${currItem.tier}`, currItem)
		return prevState
	}, state)

	return state
}
