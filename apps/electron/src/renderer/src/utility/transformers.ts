import { BulkyItem } from '@shared/types/bulky.types'
import { PoeItem } from '@shared/types/poe.types'
import { capitalize } from 'lodash'

export function transformToDisplayValue(string: string) {
	const arr = string.split('_')
	const capitalizedArr = arr.map(word => capitalize(word.toLowerCase()))
	return capitalizedArr.join(' ')
}

/**
 * Transform a Poe Item into a Bulky Item.
 * A Bulky item contains only a subset of a Poe Item's properties.
 */
export function transformPoeItemToBulkyItem(item: PoeItem) {
	const transformedItem: BulkyItem = {
		id: item.id,
		inventoryId: item.inventoryId,
		name: item.name,
		baseType: item.baseType,
		icon: item.icon,
		itemLevel: item.itemLevel,
		stackSize: item.stackSize,
		maxStackSize: item.maxStackSize,
		implicitMods: item.implicitMods,
		explicitMods: item.explicitMods,
		ultimatumMods: item.ultimatumMods,
		enchantMods: item.enchantMods,
		w: item.w,
		h: item.h,
		x: item.x,
		y: item.y,
	}

	return transformedItem
}
