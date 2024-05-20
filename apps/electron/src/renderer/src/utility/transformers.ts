import { capitalize } from 'lodash'
import { BULKY_ID } from './typedId'
import { PoeItemDto } from '@shared/types/dtoResponse.types'
import { PoeItem, PoeStashTab } from '@shared/types/poe.types'
import { BulkyItem, BulkyPriceOverrideItem, Category } from '@shared/types/bulky.types'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.static'
import { ESSENCE_TIER_NAME_TO_IDX, ESSENCE_TYPE_NAME_TO_IDX } from '@web/categories/essence/essence.const'
import { useConfigStore } from '@web/stores/configStore'

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
 * Generate a BulkyItem from a PoeItem.
 */
function poeItemToBulkyItem(item: PoeItem, category: Category): BulkyItem | undefined {
	const configStore = useConfigStore()
	let type: BulkyItem['type'] | undefined
	let tier: BulkyItem['tier'] | undefined

	if (!item.stackSize) return undefined

	if (category === 'ESSENCE') {
		type = BULKY_ESSENCES.generateEssenceTypeFromBaseType(item.baseType)
		tier = BULKY_ESSENCES.generateEssenceTierFromBaseType(item.baseType)
		if (type === undefined || tier === undefined) return
	} else {
		return undefined
	}

	// repeat the above for other categories

	return {
		type,
		tier,
		quantity: item.stackSize,
		price: 0,
		league: configStore.config.league,
		category,
		priceOverride: 0,
	}
}

function bulkyItemToPriceOverrideItem(item: BulkyItem): BulkyPriceOverrideItem {
	return {
		type: item.type,
		tier: item.tier,
		priceOverride: item.priceOverride,
		league: item.league,
		category: item.category,
	}
}

export const BULKY_TRANSFORM = {
	bulkyItemToPriceOverrideItem,
	poeItemToBulkyItem,
}
