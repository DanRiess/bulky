import { BulkyShopItemRecord, BulkyItemSortOptions, BulkyItemOverrideRecord, Category } from '@shared/types/bulky.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { PoeItem, PoeItemsByStash } from '@shared/types/poe.types'
import { RefOrGetter, getKeys, isWatchable } from '@shared/types/utility.types'
import { compareStrings } from '@web/utility/compareFunctions'
import { BULKY_FACTORY } from '@web/utility/factory'
import { MaybeRefOrGetter, Ref, ref, toValue, watch } from 'vue'

export function useBulkyItems(
	poeItems: RefOrGetter<PoeItemsByStash>,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyItemOverrideRecord>,
	category: MaybeRefOrGetter<Category>
) {
	/**
	 * Reactive map of item records.
	 * Stores records in the form [ 'itemType_itemTier', item ]
	 *
	 * @example
	 * const example = new Map([
	 * 	['GREED_DEAFENING', EssenceItem]
	 * ])
	 */
	const items = ref(new Map()) as Ref<BulkyShopItemRecord>
	const sortOptions = ref<BulkyItemSortOptions>({
		key: 'STACKPRICE',
		direction: 'DESC',
	})

	// Create a watcher that updates the items when stash selection changes.
	// Update here means fetching new tab's items from idb and deleting removed tab's items from the variable.
	// The comparison inside the watcher is only possible with a ComputedRef!
	if (isWatchable(poeItems)) {
		watch(poeItems, (newItems, oldItems) => {
			const add = getKeys(newItems).reduce((prev, curr) => {
				prev[curr] = newItems[curr].filter(item => !oldItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)
			const remove = getKeys(oldItems).reduce((prev, curr) => {
				prev[curr] = oldItems[curr].filter(item => !newItems[curr]?.includes(item))
				return prev
			}, {} as PoeItemsByStash)

			// Check if the category has changed.
			// I did not want to create a dedicated watcher for this because I'm afraid of race conditions.
			// Imagine user changes category. If this watcher triggers before the category watcher,
			// the category watcher would remove every item and we'd end up with an empty map.
			if (items.value.entries().next().value?.[1]?.category !== toValue(category)) {
				items.value = new Map()
			}

			console.log({ add, remove })

			// loop over the items, remove the old ones, add the new ones
			getKeys(add).forEach(stashTabId => {
				add[stashTabId].forEach(poeItem => putItem(poeItem))
			})

			getKeys(remove).forEach(stashTabId => {
				remove[stashTabId].forEach(poeItem => deleteItem(poeItem))
			})
		})
	}

	/**
	 * Sort the map when either ninja prices, price overrides change or the user (un)selects a stash tab.
	 * This will not trigger when items within the maps change, though it could (deep: true).
	 * Doing that would however lead to weird UX as entries will jump around while editing.
	 */
	watch([prices, priceOverrides, poeItems], () => sortItems())

	/**
	 * Add the stack size of a PoeItem to its corresponding BulkyShopItem.
	 * If the BulkyShopItem does not exist yet, create it instead.
	 */
	function putItem(poeItem: PoeItem) {
		const type = BULKY_FACTORY.getTypeFromPoeItem(poeItem, toValue(category))
		const tier = BULKY_FACTORY.getTierFromPoeItem(poeItem, toValue(category))
		console.log({ type, tier })
		if (!type || !tier) return

		const itemInMap = items.value.get(`${type}_${tier}`)

		// If this item exists already, only adjust the quantity...
		if (itemInMap) {
			itemInMap.quantity += poeItem.stackSize ?? 1
		}

		// ...otherwise, create a new BulkyShopItem and add it to the map
		else {
			const bulkyItem = BULKY_FACTORY.generateBulkyItemFromPoeItem(poeItem, toValue(category), prices, priceOverrides)
			console.log({ bulkyItem })
			if (!bulkyItem) return
			items.value.set(`${bulkyItem.type}_${bulkyItem.tier}`, bulkyItem)
		}
	}

	/**
	 * Remove the stack size of a PoeItem from its corresponding BulkyShopItem.
	 * If the stack size is 0, remove the BulkyShopItem.
	 */
	function deleteItem(poeItem: PoeItem) {
		const type = BULKY_FACTORY.getTypeFromPoeItem(poeItem, toValue(category))
		const tier = BULKY_FACTORY.getTierFromPoeItem(poeItem, toValue(category))
		if (!type || !tier) return false

		// Check if this item is in the map.
		const itemInMap = items.value.get(`${type}_${tier}`)

		if (itemInMap) {
			// Subtract this PoeItem's stack size from its corresponding BulkyShopItem.
			itemInMap.quantity -= poeItem.stackSize ?? 0

			// Remove the item from the map if its quantity is 0 or lower.
			if (itemInMap.quantity <= 0) {
				return items.value.delete(`${type}_${tier}`)
			}

			return true
		}

		return false
	}

	/**
	 * Sort the item map by a given search key.
	 */
	function sortItems(sortKey?: BulkyItemSortOptions['key']) {
		const key = sortKey ?? sortOptions.value.key

		// If the key is identical, switch the sort direction.
		if (sortKey && key === sortOptions.value.key) {
			sortOptions.value.direction = sortOptions.value.direction === 'ASC' ? 'DESC' : 'ASC'
		} else if (sortKey) {
			// Default to sorting in ascending order for strings and descending order for numbers.
			sortOptions.value.direction = key === 'NAME' ? 'ASC' : 'DESC'
			sortOptions.value.key = key
		}

		// Mathmatically, always sort in ascending order and just multiply the result by -1 if descending order is required.
		const sortModifier = sortOptions.value.direction === 'ASC' ? 1 : -1

		// Implement functions for the possible search keys.
		if (key === 'NAME') {
			items.value = new Map([...items.value.entries()].sort((a, b) => compareStrings(a[0], b[0]) * sortModifier))
		} else if (key === 'TIER') {
			items.value = new Map([...items.value.entries()].sort((a, b) => compareStrings(a[1].tier, b[1].tier) * sortModifier))
		} else if (key === 'QUANT') {
			items.value = new Map(
				[...items.value.entries()].sort((a, b) => {
					return (a[1].quantity - b[1].quantity) * sortModifier
				})
			)
		} else if (key === 'PRICE') {
			items.value = new Map(
				[...items.value.entries()].sort((a, b) => {
					const priceA = toValue(a[1].priceOverride) > 0 ? a[1].priceOverride : a[1].price
					const priceB = toValue(b[1].priceOverride) > 0 ? b[1].priceOverride : b[1].price
					return (toValue(priceA) - toValue(priceB)) * sortModifier
				})
			)
		} else if (key === 'STACKPRICE') {
			items.value = new Map(
				[...items.value.entries()].sort((a, b) => {
					const priceA = toValue(a[1].priceOverride) > 0 ? a[1].priceOverride : a[1].price
					const priceB = toValue(b[1].priceOverride) > 0 ? b[1].priceOverride : b[1].price
					return (toValue(priceA) * a[1].quantity - toValue(priceB) * b[1].quantity) * sortModifier
				})
			)
		}
	}

	return { items, sortOptions, sortItems }
}
