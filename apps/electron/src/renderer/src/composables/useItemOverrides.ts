import {
	BulkyShopItem,
	BulkyItemOverrideInstance,
	BulkyItemOverrideOptions,
	BulkyItemOverrideRecord,
	Category,
} from '@shared/types/bulky.types'
import { MaybeRefOrGetter, Ref, ref, watch } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { isWatchable } from '@shared/types/utility.types'

/**
 * This function returns a ref that holds the current category's price overrides.
 * Price overrides are saved in the price_override store in the idb.
 */
export function useItemOverrides(category: MaybeRefOrGetter<Category>) {
	const itemOverrides: Ref<BulkyItemOverrideRecord> = ref(new Map())

	// Load the current category's prices whenever the category changes.
	if (isWatchable(category)) {
		watch(
			category,
			category => {
				updateStateVariable(category).then(state => {
					itemOverrides.value = state
				})
			},
			{ immediate: true }
		)
	} else {
		updateStateVariable(category).then(state => {
			itemOverrides.value = state
		})
	}

	/**
	 * Edit or add a price override.
	 * Pass the new price as explicit parameter, since on the BulkyShopItem,
	 * the price override is computed only.
	 */
	function putItemOverride(item: BulkyShopItem, overrides: BulkyItemOverrideOptions) {
		const bulkyIdb = useBulkyIdb()

		// Generate the new override item.
		const newItem = BULKY_TRANSFORM.bulkyItemToOverrideItem(item, overrides)

		// Unset properties that should not be active if the item is unselected.
		if (newItem.selected === false) {
			newItem.allowRegexFilter !== undefined && (newItem.allowRegexFilter = false)
		}

		// Set the new item in the map.
		itemOverrides.value.set(`${newItem.type}_${newItem.tier}`, newItem)

		// Put the new item in the database.
		bulkyIdb.putItemOverride(newItem)
	}

	return { itemOverrides, putItemOverride }
}

// LOCAL API

/**
 * Load the current category's prices from idb.
 */
async function updateStateVariable(category: Category) {
	const bulkyIdb = useBulkyIdb()

	// Get overrides for this category from idb.
	const overrides = await bulkyIdb.getItemOverrideByCategory(category)
	console.log('FETCH OVERRIDES')
	console.log(overrides)

	// Transform the overrides into the form expected by the state variable
	return transformOverridesToState(overrides)
}

/**
 * Transform a price override item to the form expected by the state variable.
 */
function transformOverridesToState(overrides: BulkyItemOverrideInstance[]): BulkyItemOverrideRecord {
	const state = new Map() as BulkyItemOverrideRecord

	overrides.reduce((prevState, currItem) => {
		prevState.set(`${currItem.type}_${currItem.tier}`, currItem)
		return prevState
	}, state)

	return state
}
