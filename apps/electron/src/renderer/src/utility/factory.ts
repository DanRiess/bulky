/**
 * This script exposes some factory methods.
 * In the case of this app, this depends most often (always?) on the passed category.
 *
 * E. g. our code expects a category offer store, but doesn't care which one.
 * The respective factory will return the correct one.
 */

import {
	BulkyBazaarItem,
	BulkyBazaarItemDto,
	BulkyFilterStore,
	BulkyItemOverrideRecord,
	BulkyOfferStore,
	BulkyShopItem,
	Category,
} from '@shared/types/bulky.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { PoeItem } from '@shared/types/poe.types'
import { getKeys } from '@shared/types/utility.types'
import {
	DELI_ORB_TYPE,
	DELI_ORB_TYPE_IDX_TO_NAME,
	DELI_ORB_TYPE_NAME_TO_IDX,
} from '@web/categories/deliriumOrb/deliriumOrb.const'
import { BULKY_DELIRIUM_ORBS } from '@web/categories/deliriumOrb/deliriumOrb.transformers'
import { DeliriumOrbTier } from '@web/categories/deliriumOrb/deliriumOrb.types'
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import {
	ESSENCE_TIER,
	ESSENCE_TIER_IDX_TO_NAME,
	ESSENCE_TIER_NAME_TO_IDX,
	ESSENCE_TYPE,
	ESSENCE_TYPE_IDX_TO_NAME,
	ESSENCE_TYPE_NAME_TO_IDX,
} from '@web/categories/essence/essence.const'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.transformers'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { BULKY_MAPS } from '@web/categories/map/map.transformers'
import { SCARAB_TYPE, SCARAB_TYPE_IDX_TO_NAME, SCARAB_TYPE_NAME_TO_IDX } from '@web/categories/scarab/scarab.const'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.transformers'
import { ScarabTier } from '@web/categories/scarab/scarab.types'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { Ref } from 'vue'

export const BULKY_FACTORY = {
	getOfferStore,
	getFilterStore,
	getNameToIdxTypeMap,
	getNameToIdxTierMap,
	getIdxToNameTypeMap,
	getIdxToNameTierMap,
	getItemTypes,
	getItemTiers,
	getTypeFromPoeItem,
	getTierFromPoeItem,
	generateBulkyItemFromPoeItem,
	getNameFromTypeAndTier,
	generateTypedItemFromDto,
}

/**
 * Get the offer store of the consumed category.
 */
function getOfferStore(category: Category): BulkyOfferStore | undefined {
	if (category === 'ESSENCE') return useEssenceOfferStore()
	else if (category === 'SCARAB') return useScarabOfferStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbOfferStore()
	return undefined
}

/**
 * Get the filter store of the consumed category.
 */
function getFilterStore(category: Category): BulkyFilterStore | undefined {
	if (category === 'ESSENCE') return useEssenceFilterStore()
	else if (category === 'SCARAB') return useScarabFilterStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbFilterStore()
	return undefined
}

// NAME TO INDEX MAPPERS

/**
 * Get a type's name -> idx mapper for a category.
 */
function getNameToIdxTypeMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TYPE_NAME_TO_IDX
	else if (category === 'SCARAB') return SCARAB_TYPE_NAME_TO_IDX
	else if (category === 'DELIRIUM_ORB') return DELI_ORB_TYPE_NAME_TO_IDX
	return undefined
}

/**
 * Get a tier's name -> idx mapper for a category.
 */
function getNameToIdxTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_NAME_TO_IDX
	else if (category === 'SCARAB') return { '0': 0 }
	else if (category === 'DELIRIUM_ORB') return { '0': 0 }
	return undefined
}

// IDX TO NAME MAPPERS

/**
 * Get a type's idx -> name mapper for a category.
 */
function getIdxToNameTypeMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TYPE_IDX_TO_NAME
	else if (category === 'SCARAB') return SCARAB_TYPE_IDX_TO_NAME
	else if (category === 'DELIRIUM_ORB') return DELI_ORB_TYPE_IDX_TO_NAME
	return undefined
}

/**
 * Get a tier's idx -> name mapper for a category.
 */
function getIdxToNameTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_IDX_TO_NAME
	else if (category === 'SCARAB') return ['0'] as ScarabTier[]
	else if (category === 'DELIRIUM_ORB') return ['0'] as DeliriumOrbTier[]
	return undefined
}

/**
 * Get all item types from a category.
 */
function getItemTypes(category: Category): BulkyBazaarItem['type'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TYPE)
	else if (category === 'SCARAB') return getKeys(SCARAB_TYPE)
	else if (category === 'DELIRIUM_ORB') return getKeys(DELI_ORB_TYPE)
	else return undefined
}

/**
 * Get all item tiers from a category.
 */
function getItemTiers(category: Category): BulkyBazaarItem['tier'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TIER)
	else if (category === 'SCARAB') return ['0']
	else if (category === 'DELIRIUM_ORB') return ['0']
	else return undefined
}

/**
 * Get the Bulky type from a PoeItem.
 */
function getTypeFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['type'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTypeFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateTypeFromBaseType(item.baseType)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateTypeFromBaseType(item.baseType)
	else return undefined
}

/**
 * Get the Bulky tier from a PoeItem.
 */
function getTierFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['tier'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTierFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateScarabTier()
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateDeliriumOrbTier()
	else return undefined
}

/**
 * Generate a BulkyItem from a PoeItem (and its prices and overrides).
 */
function generateBulkyItemFromPoeItem(
	item: PoeItem,
	category: Category,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): BulkyShopItem | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateEssenceFromPoeItem(item, prices, itemOverrides)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateScarabFromPoeItem(item, prices, itemOverrides)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateDeliriumOrbFromPoeItem(item, prices, itemOverrides)
	else return undefined
}

/**
 * Get the name that will be displayed in the filter 'type' field.
 */
function getNameFromTypeAndTier(
	category: Category,
	item: { type: string; tier: string; quantity: number; price: number }
): string | undefined {
	if (category === 'ESSENCE' && useEssenceOfferStore().isEssence(item))
		return BULKY_ESSENCES.generateEssenceNameFromTypeAndTier(item.type, item.tier)
	else if (category === 'SCARAB' && useScarabOfferStore().isScarab(item))
		return BULKY_SCARABS.generateScarabNameFromType(item.type)
	else if (category === 'DELIRIUM_ORB' && useDeliriumOrbOfferStore().isDeliriumOrb(item))
		return BULKY_DELIRIUM_ORBS.generateDeliriumOrbNameFromType(item.type)
	else return undefined
}
// function getNameForFilterFieldTypeOption<T extends BulkyFilterField>(field: T): string | undefined {
// 	if (field.category === 'ESSENCE') return BULKY_ESSENCES.generateEssenceNameFromTypeAndTier(field.type, field.tier)
// 	else if (field.category === 'SCARAB') return BULKY_SCARABS.generateScarabNameFromType(field.type)
// 	else if (field.category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateDeliriumOrbNameFromType(field.type)
// 	else return undefined
// }

function generateTypedItemFromDto<T extends Category>(category: T, item: BulkyBazaarItemDto) {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateBazaarItemFromDto(item)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateBazaarItemFromDto(item)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateBazaarItemFromDto(item)
	else if (category === 'MAP') return BULKY_MAPS.generateBazaarItemFromDto(item)
	else return undefined
}
