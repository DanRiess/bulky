import { BulkyShopItem, BulkyShopItemRecord, ShopFilter } from '@shared/types/bulky.types'
import { MaybeRef, MaybeRefOrGetter, computed, toValue } from 'vue'

export function useFilterShopItems<T extends BulkyShopItem>(
	itemRecord: MaybeRef<BulkyShopItemRecord<T>>,
	filter: MaybeRefOrGetter<ShopFilter<T>>
) {
	const filteredItemRecord = computed<BulkyShopItemRecord>(() => {
		// TODO: check if this kills computed reactivity
		if (toValue(filter).selectedTiers?.size === 0) return toValue(itemRecord)

		const filteredItems: BulkyShopItemRecord = new Map()

		toValue(itemRecord).forEach(item => {
			// if selected tiers dont exist, set item
			if (toValue(filter).selectedTiers && !toValue(filter).selectedTiers?.has(item.tier)) return
			filteredItems.set(`${item.type}_${item.tier}`, item)
		})

		return filteredItems
	})

	return { filteredItemRecord }
}
