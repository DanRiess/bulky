/**
 * This script exposes some factory methods.
 * In the case of this app, this depends most often (always?) on the passed category.
 *
 * E. g. our code expects a category offer store, but doesn't care which one.
 * The respective factory will return the correct one.
 */

import { BulkyFilterStore, BulkyOfferStore, Category } from '@shared/types/bulky.types'
import { ESSENCE_TIER_NAME_TO_IDX, ESSENCE_TYPE_NAME_TO_IDX } from '@web/categories/essence/essence.const'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { SCARAB_TYPE_IDX_TO_NAME, SCARAB_TYPE_NAME_TO_IDX } from '@web/categories/scarab/scarab.const'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'

export const BULKY_FACTORY = {
	getOfferStore,
	getFilterStore,
	getNameToIdxTypeMap,
	getNameToIdxTierMap,
}

function getOfferStore(category: Category): BulkyOfferStore | undefined {
	if (category === 'ESSENCE') return useEssenceOfferStore()
	else if (category === 'SCARAB') return useScarabOfferStore()
	return undefined
}

function getFilterStore(category: Category): BulkyFilterStore | undefined {
	if (category === 'ESSENCE') return useEssenceFilterStore()
	else if (category === 'SCARAB') return useScarabFilterStore()
	return undefined
}

function getNameToIdxTypeMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TYPE_NAME_TO_IDX
	else if (category === 'SCARAB') return SCARAB_TYPE_NAME_TO_IDX
	return undefined
}

function getNameToIdxTierMap(category: Category) {
	if (category === 'ESSENCE') return ESSENCE_TIER_NAME_TO_IDX
	else if (category === 'SCARAB') return SCARAB_TYPE_IDX_TO_NAME
	return undefined
}
