/** Define types for essence offers and filters here. */

import { ObjectValues } from '@shared/types/utility.types'
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'
import { useEssenceOfferStore } from './essenceOffers.store'
import { useEssenceFilterStore } from './essenceFilter.store'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'

// STORE TYPES

export type EssenceOfferStore = ReturnType<typeof useEssenceOfferStore>
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

/** BulkyBazaarOffer implementation for the essence category */
export type BazaarEssenceOffer = BulkyBazaarOffer<BazaarEssence>

// FILTER TYPES

/** FilterField implementation for the essence category */
export type EssenceFilterField = BulkyFilterFieldBase<typeof CATEGORY.ESSENCE> & {
	type: EssenceType
	tier: EssenceTier
}

/** Filter implementation for the essence category */
export type EssenceFilter = BulkyFilter<EssenceFilterField>
