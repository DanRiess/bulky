import { capitalize } from 'lodash'
import { BULKY_ID } from './typedId'
import { PoeItemDto } from '@shared/types/dtoResponse.types'
import { PoeItem, PoeStashTab } from '@shared/types/poe.types'
import { BulkyShopItem, BulkyItemOverrideInstance, BulkyItemOverrideRecord, Category } from '@shared/types/bulky.types'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.static'
import { Ref, toValue } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.static'

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

function poeItemBaseTypeToBulkyTypeAndTier(
	item: PoeItem,
	category: Category
): { type: BulkyShopItem['type']; tier: BulkyShopItem['tier'] } | undefined {
	let type: BulkyShopItem['type'] | undefined
	let tier: BulkyShopItem['tier'] | undefined

	if (category === 'ESSENCE') {
		type = BULKY_ESSENCES.generateEssenceTypeFromBaseType(item.baseType)
		tier = BULKY_ESSENCES.generateEssenceTierFromBaseType(item.baseType)
		if (type === undefined || tier === undefined) return
	} else if (category === 'SCARAB') {
		type = BULKY_SCARABS.generateScarabTypeFromBaseType(item.baseType)
		tier = BULKY_SCARABS.generateScarabTier()
		if (type === undefined) return
	} else {
		return undefined
	}

	return { type, tier }
}

/**
 * Generate a BulkyShopItem from a PoeItem.
 */
function poeItemToBulkyItem(
	item: PoeItem,
	category: Category,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyItemOverrideRecord>
): BulkyShopItem | undefined {
	if (category === 'ESSENCE') {
		return BULKY_ESSENCES.generateEssenceFromPoeItem(item, prices, priceOverrides)
	} else if (category === 'SCARAB') {
		return BULKY_SCARABS.generateScarabFromPoeItem(item, prices, priceOverrides)
	}

	return undefined
}

function bulkyItemToPriceOverrideItem(
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

export const BULKY_TRANSFORM = {
	bulkyItemToPriceOverrideItem,
	poeItemBaseTypeToBulkyTypeAndTier,
	poeItemToBulkyItem,
}
