/**
 * This script exposes some factory methods.
 * In the case of this app, this depends most often (always?) on the passed category.
 *
 * E. g. our code expects a category offer store, but doesn't care which one.
 * The respective factory will return the correct one.
 */

import {
	BulkyBazaarItem,
	BulkyFilterField,
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
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import {
	ESSENCE_TIER,
	ESSENCE_TIER_NAME_TO_IDX,
	ESSENCE_TYPE,
	ESSENCE_TYPE_NAME_TO_IDX,
} from '@web/categories/essence/essence.const'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.transformers'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { SCARAB_TYPE, SCARAB_TYPE_IDX_TO_NAME, SCARAB_TYPE_NAME_TO_IDX } from '@web/categories/scarab/scarab.const'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.transformers'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { Ref } from 'vue'

export const BULKY_FACTORY = {
	getOfferStore,
	getFilterStore,
	getNameToIdxTypeMap,
	getNameToIdxTierMap,
	getItemTypes,
	getItemTiers,
	getTypeFromPoeItem,
	getTierFromPoeItem,
	generateBulkyItemFromPoeItem,
	getNameForFilterFieldTypeOption,
}

function getOfferStore(category: Category): BulkyOfferStore | undefined {
	if (category === 'ESSENCE') return useEssenceOfferStore()
	else if (category === 'SCARAB') return useScarabOfferStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbOfferStore()
	return undefined
}

function getFilterStore(category: Category): BulkyFilterStore | undefined {
	if (category === 'ESSENCE') return useEssenceFilterStore()
	else if (category === 'SCARAB') return useScarabFilterStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbFilterStore()
	return undefined
}

function getNameToIdxTypeMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TYPE_NAME_TO_IDX
	else if (category === 'SCARAB') return SCARAB_TYPE_NAME_TO_IDX
	else if (category === 'DELIRIUM_ORB') return DELI_ORB_TYPE_NAME_TO_IDX
	return undefined
}

function getNameToIdxTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_NAME_TO_IDX
	else if (category === 'SCARAB') return SCARAB_TYPE_IDX_TO_NAME
	else if (category === 'DELIRIUM_ORB') return DELI_ORB_TYPE_IDX_TO_NAME
	return undefined
}

function getItemTypes(category: Category): BulkyBazaarItem['type'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TYPE)
	else if (category === 'SCARAB') return getKeys(SCARAB_TYPE)
	else if (category === 'DELIRIUM_ORB') return getKeys(DELI_ORB_TYPE)
	else return undefined
}

function getItemTiers(category: Category): BulkyBazaarItem['tier'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TIER)
	else if (category === 'SCARAB') return ['0']
	else if (category === 'DELIRIUM_ORB') return ['0']
	else return undefined
}

function getTypeFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['type'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTypeFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateTypeFromBaseType(item.baseType)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateTypeFromBaseType(item.baseType)
	else return undefined
}

function getTierFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['tier'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTierFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateScarabTier()
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateDeliriumOrbTier()
	else return undefined
}

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

function getNameForFilterFieldTypeOption<T extends BulkyFilterField>(field: T): string | undefined {
	if (field.category === 'ESSENCE') return BULKY_ESSENCES.generateEssenceNameFromTypeAndTier(field.type, field.tier)
	else if (field.category === 'SCARAB') return BULKY_SCARABS.generateScarabNameFromType(field.type)
	else if (field.category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateDeliriumOrbNameFromType(field.type)
	else return undefined
}
