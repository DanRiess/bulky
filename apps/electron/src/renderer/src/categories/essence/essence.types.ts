/** Define types for essence offers and filters here. */

import { ObjectValues } from '@shared/types/utility.types'
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'
import { useEssenceOfferStore } from './essenceOffers.store'
import { useEssenceFilterStore } from './essenceFilter.store'
import { BulkyBazaarItemBase, BulkyFilterFieldBase, BulkyShopItemBase, CATEGORY } from '@shared/types/bulky.types'

// STORE TYPES

export type EssenceListingStore = ReturnType<typeof useEssenceOfferStore>
export type EssenceFilterStore = ReturnType<typeof useEssenceFilterStore>

// ITEM TYPES

/** All possible essence base types */
export type EssenceType = ObjectValues<typeof ESSENCE_TYPE>

/** All possible essence tiers */
export type EssenceTier = ObjectValues<typeof ESSENCE_TIER>

/** BulkyShopItem implementation for the essence category */
export type ShopEssence = BulkyShopItemBase<typeof CATEGORY.ESSENCE> & {
	type: EssenceType
	tier: EssenceTier
}

/** BulkyBazaarItem implementation for the essence category */
export type BazaarEssence = BulkyBazaarItemBase & {
	type: EssenceType
	tier: EssenceTier
}

// FILTER TYPES

/** FilterField implementation for the essence category */
export type EssenceFilterField = BulkyFilterFieldBase<typeof CATEGORY.ESSENCE> & {
	type: EssenceType
	tier: EssenceTier
}

// // LISTING TYPES

// /** extend the generic to include essence specific data */
// export type ShopEssence = GenericItemData<EssenceTier>

// /** extend the generic to include essence specific data */
// export type EssenceListingItems = GenericListingItems<EssenceType, EssenceTier>

// /** narrow the generic listing to the essence type */
// export interface EssenceListing extends GenericListing<EssenceListing, EssenceListingItems> {}

// /** defines the map that is used as state in the essence store */
// export type EssenceListings = GenericListings<EssenceListing>

// // FILTER TYPES

// /** narrow the generic filter field to the compass type */
// export interface EssenceFilterField extends GenericFilterField<EssenceFilterField, EssenceType, EssenceTier> {}

// /** narrow the generic filter to the compass type */
// export interface EssenceFilter extends GenericFilter<EssenceFilter, EssenceFilterField> {}

// /** defines the map that is used as state in the filter store */
// export type EssenceFilters = Map<Uuid<EssenceFilter>, EssenceFilter>
