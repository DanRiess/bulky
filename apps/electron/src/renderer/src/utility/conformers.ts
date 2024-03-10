import { GenericListingItem, Item, ItemType } from '@web/types/bulky.types'
import { GenericListingItemDto } from '@web/types/dto.types'
import { PartialRecord } from '@web/types/utitlity.types'

/**
 * Transform items of one listing to Bulky standard object type.
 *
 * Performance: ~0.02 ms per listing with 20 items
 */
export function conformListingItems<T extends Item>(
	items: GenericListingItemDto[],
	conformItemKey: (arg: string) => ItemType,
	conformItemValue: (arg: GenericListingItemDto) => T | null
) {
	const conformedItems = items.reduce((prev, curr) => {
		const key = conformItemKey(curr.name)
		if (key === 'UNSUPPORTED') return prev

		if (!prev[key]) {
			prev[key] = []
		}

		const value = conformItemValue(curr)
		if (!value) return prev

		prev[key]?.push(value)
		return prev
	}, {} as PartialRecord<ItemType, GenericListingItem<T>[]>)

	return conformedItems
}
