import { capitalize } from 'lodash'
import { BULKY_ID } from './typedId'
import { PoeItemDto } from '@shared/types/dtoResponse.types'
import { PoeItem, PoeStashTab } from '@shared/types/poe.types'
import { BulkyShopItem, BulkyItemOverrideInstance, BulkyBazaarItemDto } from '@shared/types/bulky.types'
import { UnwrapRef, toValue } from 'vue'
import { BULKY_FACTORY } from './factory'

export function transformToDisplayValue(string: string) {
	const arr = string.split('_')
	const capitalizedArr = arr.map(word => capitalize(word.toLowerCase()))
	return capitalizedArr.join(' ')
}

/**
 * Generate a PoeItem from its corresponding dto.
 */
export function generatePoeItemFromDto(item: PoeItemDto, stashTab: PoeStashTab) {
	const poeItem: PoeItem = {
		id: BULKY_ID.generateTypedId(item.id),
		stashTabId: stashTab.id,
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

	return poeItem
}

/**
 * Extract overridable properties from a BulkyItem.
 * Generates an object that can be used in the item override store in idb.
 */
function bulkyItemToOverrideItem(
	item: BulkyShopItem,
	overrides: { price?: number; selected?: boolean }
): BulkyItemOverrideInstance {
	return {
		type: item.type,
		tier: item.tier,
		priceOverride: overrides.price ?? toValue(item.priceOverride),
		league: item.league,
		category: item.category,
		selected: overrides.selected ?? toValue(item.selected),
	}
}

function bulkyItemToBazaarItemDto(item: BulkyShopItem | UnwrapRef<BulkyShopItem>): BulkyBazaarItemDto | undefined {
	const nameToIdxTypeMap = BULKY_FACTORY.getNameToIdxTypeMap(item.category)
	const nameToIdxTierMap = BULKY_FACTORY.getNameToIdxTierMap(item.category)

	if (nameToIdxTypeMap === undefined || nameToIdxTierMap === undefined) return

	const price = toValue(item.priceOverride) > 0 ? toValue(item.priceOverride) : toValue(item.price)

	const itemDto: BulkyBazaarItemDto = {
		type: nameToIdxTypeMap[item.type],
		tier: nameToIdxTierMap[item.tier],
		qnt: item.quantity,
		prc: price,
	}

	if (item.options) {
		// TODO: apply options
		const options = undefined
		itemDto.opt = options
	}

	return itemDto
}

export const BULKY_TRANSFORM = {
	bulkyItemToOverrideItem,
	bulkyItemToBazaarItemDto,
}
