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
import { BEAST_TYPE, BEAST_TYPE_IDX_TO_NAME, BEAST_TYPE_NAME_TO_IDX } from '@web/categories/beastiary/bestiary.const'
import { BULKY_BESTIARY } from '@web/categories/beastiary/bestiary.transformers'
import { BeastTier } from '@web/categories/beastiary/bestiary.types'
import { useBestiaryFilterStore } from '@web/categories/beastiary/bestiaryFilter.store'
import { useBestiaryOfferStore } from '@web/categories/beastiary/bestiaryOffers.store'
import { CATALYST_TYPE, CATALYST_TYPE_IDX_TO_NAME, CATALYST_TYPE_NAME_TO_IDX } from '@web/categories/catalyst/catalyst.const'
import { BULKY_CATALYSTS } from '@web/categories/catalyst/catalyst.transformers'
import { CatalystTier } from '@web/categories/catalyst/catalyst.types'
import { useCatalystFilterStore } from '@web/categories/catalyst/catalystFilter.store'
import { useCatalystOfferStore } from '@web/categories/catalyst/catalystOffers.store'
import { CURRENCY_TYPE, CURRENCY_TYPE_IDX_TO_NAME, CURRENCY_TYPE_NAME_TO_IDX } from '@web/categories/currency/currency.const'
import { BULKY_CURRENCY } from '@web/categories/currency/currency.transformers'
import { CurrencyTier } from '@web/categories/currency/currency.types'
import { useCurrencyFilterStore } from '@web/categories/currency/currencyFilter.store'
import { useCurrencyOfferStore } from '@web/categories/currency/currencyOffers.store'
import {
	DELI_ORB_TYPE,
	DELI_ORB_TYPE_IDX_TO_NAME,
	DELI_ORB_TYPE_NAME_TO_IDX,
} from '@web/categories/deliriumOrb/deliriumOrb.const'
import { BULKY_DELIRIUM_ORBS } from '@web/categories/deliriumOrb/deliriumOrb.transformers'
import { DeliriumOrbTier } from '@web/categories/deliriumOrb/deliriumOrb.types'
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import { DELVE_TYPE, DELVE_TYPE_IDX_TO_NAME, DELVE_TYPE_NAME_TO_IDX } from '@web/categories/delve/delve.const'
import { BULKY_DELVE } from '@web/categories/delve/delve.transformers'
import { DelveTier } from '@web/categories/delve/delve.types'
import { useDelveFilterStore } from '@web/categories/delve/delveFilter.store'
import { useDelveOfferStore } from '@web/categories/delve/delveOffers.store'
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
import {
	HEIST_TIER,
	HEIST_TIER_IDX_TO_NAME,
	HEIST_TIER_NAME_TO_IDX,
	HEIST_TYPE,
	HEIST_TYPE_IDX_TO_NAME,
	HEIST_TYPE_NAME_TO_IDX,
} from '@web/categories/heist/heist.const'
import { BULKY_HEIST } from '@web/categories/heist/heist.transformers'
import { useHeistFilterStore } from '@web/categories/heist/heistFilter.store'
import { useHeistOfferStore } from '@web/categories/heist/heistOffers.store'
import {
	MAP_TIER,
	MAP_TIER_IDX_TO_NAME,
	MAP_TIER_NAME_TO_IDX,
	MAP_TYPE,
	MAP_TYPE_IDX_TO_NAME,
	MAP_TYPE_NAME_TO_IDX,
} from '@web/categories/map/map.const'
import { BULKY_MAPS } from '@web/categories/map/map.transformers'
import { useMap8ModFilterStore } from '@web/categories/map/map8ModFilter.store'
import { useMap8ModOfferStore } from '@web/categories/map/map8ModOffers.store'
import { useNormalMapFilterStore } from '@web/categories/map/normalMapFilter.store'
import { useNormalMapOfferStore } from '@web/categories/map/normalMapOffers.store'
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
	generateBazaarItemFromDto,
	getPerItemAttributes,
}

/**
 * Get the offer store of the consumed category.
 */
function getOfferStore(category: Category): BulkyOfferStore | undefined {
	if (category === 'ESSENCE') return useEssenceOfferStore()
	else if (category === 'SCARAB') return useScarabOfferStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbOfferStore()
	else if (category === 'MAP') return useNormalMapOfferStore()
	else if (category === 'MAP_8_MOD') return useMap8ModOfferStore()
	else if (category === 'BESTIARY') return useBestiaryOfferStore()
	else if (category === 'DELVE') return useDelveOfferStore()
	else if (category === 'CATALYST') return useCatalystOfferStore()
	else if (category === 'CURRENCY') return useCurrencyOfferStore()
	else if (category === 'HEIST') return useHeistOfferStore()
	return undefined
}

/**
 * Get the filter store of the consumed category.
 */
function getFilterStore(category: Category): BulkyFilterStore | undefined {
	if (category === 'ESSENCE') return useEssenceFilterStore()
	else if (category === 'SCARAB') return useScarabFilterStore()
	else if (category === 'DELIRIUM_ORB') return useDeliriumOrbFilterStore()
	else if (category === 'MAP') return useNormalMapFilterStore()
	else if (category === 'MAP_8_MOD') return useMap8ModFilterStore()
	else if (category === 'BESTIARY') return useBestiaryFilterStore()
	else if (category === 'DELVE') return useDelveFilterStore()
	else if (category === 'CATALYST') return useCatalystFilterStore()
	else if (category === 'CURRENCY') return useCurrencyFilterStore()
	else if (category === 'HEIST') return useHeistFilterStore()
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
	else if (category === 'MAP' || category === 'MAP_8_MOD') return MAP_TYPE_NAME_TO_IDX
	else if (category === 'BESTIARY') return BEAST_TYPE_NAME_TO_IDX
	else if (category === 'DELVE') return DELVE_TYPE_NAME_TO_IDX
	else if (category === 'CATALYST') return CATALYST_TYPE_NAME_TO_IDX
	else if (category === 'CURRENCY') return CURRENCY_TYPE_NAME_TO_IDX
	else if (category === 'HEIST') return HEIST_TYPE_NAME_TO_IDX
	return undefined
}

/**
 * Get a tier's name -> idx mapper for a category.
 */
function getNameToIdxTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_NAME_TO_IDX
	else if (category === 'SCARAB') return { '0': 0 }
	else if (category === 'DELIRIUM_ORB') return { '0': 0 }
	else if (category === 'MAP' || category === 'MAP_8_MOD') return MAP_TIER_NAME_TO_IDX
	else if (category === 'BESTIARY') return { '0': 0 }
	else if (category === 'DELVE') return { '0': 0 }
	else if (category === 'CATALYST') return { '0': 0 }
	else if (category === 'CURRENCY') return { '0': 0 }
	else if (category === 'HEIST') return HEIST_TIER_NAME_TO_IDX
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
	else if (category === 'MAP' || category === 'MAP_8_MOD') return MAP_TYPE_IDX_TO_NAME
	else if (category === 'BESTIARY') return BEAST_TYPE_IDX_TO_NAME
	else if (category === 'DELVE') return DELVE_TYPE_IDX_TO_NAME
	else if (category === 'CATALYST') return CATALYST_TYPE_IDX_TO_NAME
	else if (category === 'CURRENCY') return CURRENCY_TYPE_IDX_TO_NAME
	else if (category === 'HEIST') return HEIST_TYPE_IDX_TO_NAME
	return undefined
}

/**
 * Get a tier's idx -> name mapper for a category.
 */
function getIdxToNameTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_IDX_TO_NAME
	else if (category === 'SCARAB') return ['0'] as ScarabTier[]
	else if (category === 'DELIRIUM_ORB') return ['0'] as DeliriumOrbTier[]
	else if (category === 'MAP' || category === 'MAP_8_MOD') return MAP_TIER_IDX_TO_NAME
	else if (category === 'BESTIARY') return ['0'] as BeastTier[]
	else if (category === 'DELVE') return ['0'] as DelveTier[]
	else if (category === 'CATALYST') return ['0'] as CatalystTier[]
	else if (category === 'CURRENCY') return ['0'] as CurrencyTier[]
	else if (category === 'HEIST') return HEIST_TIER_IDX_TO_NAME
	return undefined
}

/**
 * Get all item types from a category.
 */
function getItemTypes(category: Category): BulkyBazaarItem['type'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TYPE)
	else if (category === 'SCARAB') return getKeys(SCARAB_TYPE)
	else if (category === 'DELIRIUM_ORB') return getKeys(DELI_ORB_TYPE)
	else if (category === 'MAP' || category === 'MAP_8_MOD') return getKeys(MAP_TYPE)
	else if (category === 'BESTIARY') return getKeys(BEAST_TYPE)
	else if (category === 'DELVE') return getKeys(DELVE_TYPE)
	else if (category === 'CATALYST') return getKeys(CATALYST_TYPE)
	else if (category === 'CURRENCY') return getKeys(CURRENCY_TYPE)
	else if (category === 'HEIST') return getKeys(HEIST_TYPE)
	else return undefined
}

/**
 * Get all item tiers from a category.
 */
function getItemTiers(category: Category): BulkyBazaarItem['tier'][] | undefined {
	if (category === 'ESSENCE') return getKeys(ESSENCE_TIER)
	else if (category === 'SCARAB') return ['0']
	else if (category === 'DELIRIUM_ORB') return ['0']
	else if (category === 'MAP' || category === 'MAP_8_MOD') return getKeys(MAP_TIER)
	else if (category === 'BESTIARY') return ['0']
	else if (category === 'DELVE') return ['0']
	else if (category === 'CATALYST') return ['0']
	else if (category === 'CURRENCY') return ['0']
	else if (category === 'HEIST') return getKeys(HEIST_TIER)
	else return undefined
}

/**
 * Get the Bulky type from a PoeItem.
 */
function getTypeFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['type'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTypeFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateTypeFromBaseType(item.baseType)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateTypeFromBaseType(item.baseType)
	else if (category === 'MAP' || category === 'MAP_8_MOD') return BULKY_MAPS.generateTypeFromBaseType(item.baseType)
	else if (category === 'BESTIARY') return BULKY_BESTIARY.generateTypeFromPoeItem(item)
	else if (category === 'DELVE') return BULKY_DELVE.generateTypeFromBaseType(item.baseType)
	else if (category === 'CATALYST') return BULKY_CATALYSTS.generateTypeFromBaseType(item.baseType)
	else if (category === 'CURRENCY') return BULKY_CURRENCY.generateTypeFromBaseType(item.baseType)
	else if (category === 'HEIST') return BULKY_HEIST.generateTypeFromPoeItem(item)
	else return undefined
}

/**
 * Get the Bulky tier from a PoeItem.
 */
function getTierFromPoeItem(item: PoeItem, category: Category): BulkyShopItem['tier'] | undefined {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateTierFromBaseType(item.baseType)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateTier()
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateTier()
	else if (category === 'MAP' || category === 'MAP_8_MOD') return BULKY_MAPS.generateTierFromProperty(item.properties)
	else if (category === 'BESTIARY') return BULKY_BESTIARY.generateTier()
	else if (category === 'DELVE') return BULKY_DELVE.generateTier()
	else if (category === 'CATALYST') return BULKY_CATALYSTS.generateTier()
	else if (category === 'CURRENCY') return BULKY_CURRENCY.generateTier()
	else if (category === 'HEIST') return BULKY_HEIST.generateTierFromItemLevel(item.ilvl)
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
		return BULKY_ESSENCES.generateNameFromTypeAndTier(item.type, item.tier)
	else if (category === 'SCARAB' && useScarabOfferStore().isScarab(item)) return BULKY_SCARABS.generateNameFromType(item.type)
	else if (category === 'DELIRIUM_ORB' && useDeliriumOrbOfferStore().isDeliriumOrb(item))
		return BULKY_DELIRIUM_ORBS.generateNameFromType(item.type)
	else if (category === 'MAP' && useNormalMapOfferStore().isNormalMap(item)) return BULKY_MAPS.generateNameFromType(item.type)
	else if (category === 'MAP_8_MOD' && useMap8ModOfferStore().isMap8Mod(item)) return BULKY_MAPS.generateNameFromType(item.type)
	else if (category === 'BESTIARY' && useBestiaryOfferStore().isBeast(item))
		return BULKY_BESTIARY.generateNameFromType(item.type)
	else if (category === 'DELVE' && useDelveOfferStore().isDelveItem(item)) return BULKY_DELVE.generateNameFromType(item.type)
	else if (category === 'CATALYST' && useCatalystOfferStore().isCatalyst(item))
		return BULKY_CATALYSTS.generateNameFromType(item.type)
	else if (category === 'CURRENCY' && useCurrencyOfferStore().isCurrencyItem(item))
		return BULKY_CURRENCY.generateNameFromType(item.type)
	else if (category === 'HEIST' && useHeistOfferStore().isHeistItem(item)) return BULKY_HEIST.generateNameFromType(item.type)
	else return undefined
}

/**
 * Generate a BazaarItem from a Bulky Offer DTO.
 */
function generateBazaarItemFromDto(category: Category, item: BulkyBazaarItemDto) {
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateBazaarItemFromDto(item)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateBazaarItemFromDto(item)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateBazaarItemFromDto(item)
	else if (category === 'MAP') return BULKY_MAPS.generateBazaarItemFromDto(item)
	// does not need a Map_8_MOD implementation because the dto is different
	else if (category === 'BESTIARY') return BULKY_BESTIARY.generateBazaarItemFromDto(item)
	else if (category === 'DELVE') return BULKY_DELVE.generateBazaarItemFromDto(item)
	else if (category === 'CATALYST') return BULKY_CATALYSTS.generateBazaarItemFromDto(item)
	else if (category === 'CURRENCY') return BULKY_CURRENCY.generateBazaarItemFromDto(item)
	else if (category === 'HEIST') return BULKY_HEIST.generateBazaarItemFromDto(item)
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
	if (category === 'ESSENCE') return BULKY_ESSENCES.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'SCARAB') return BULKY_SCARABS.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'DELIRIUM_ORB') return BULKY_DELIRIUM_ORBS.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'MAP') return BULKY_MAPS.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'MAP_8_MOD') return BULKY_MAPS.generateShopMap8ModItemFromPoeItem(item, itemOverrides)
	else if (category === 'BESTIARY') return BULKY_BESTIARY.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'DELVE') return BULKY_DELVE.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'CATALYST') return BULKY_CATALYSTS.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'CURRENCY') return BULKY_CURRENCY.generateShopItemFromPoeItem(item, prices, itemOverrides)
	else if (category === 'HEIST') return BULKY_HEIST.generateShopItemFromPoeItem(item, itemOverrides)
	else return undefined
}

/**
 * Get an item's attributes.
 * Properties will be transformed to key/value pairs, modifiers will be mapped to a number[].
 * E. g. attributes for the Map8Mod category.
 */
function getPerItemAttributes(category: Category, item: PoeItem) {
	if (category === 'MAP_8_MOD') return BULKY_MAPS.getPerItemAttributes(item)
	return undefined
}
