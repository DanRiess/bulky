import { ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { HEIST_TIER, HEIST_TYPE } from './heist.const'
import { useHeistOfferStore } from './heistOffers.store'
import { useHeistFilterStore } from './heistFilter.store'

// STORE TYPES
export type HeistOfferStore = ReturnType<typeof useHeistOfferStore>
export type HeistFilterStore = ReturnType<typeof useHeistFilterStore>

// ITEM TYPES

/** All possible heist base types */
export type HeistType = ObjectValues<typeof HEIST_TYPE>

/** All possible heist tiers. */
export type HeistTier = ObjectValues<typeof HEIST_TIER>

/** BulkyShopItem implementation for the heist category */
export type ShopHeistItem = BulkyShopItemBase<typeof CATEGORY.HEIST> & {
	type: HeistType
	tier: HeistTier
}

/** BulkyBazaarItem implementation for the heist category */
export type BazaarHeistItem = BulkyBazaarItemBase<typeof CATEGORY.HEIST> & {
	type: HeistType
	tier: HeistTier
	price: number
}

/** BulkyBazaarOffer implementation for the heist category */
export type BazaarHeistOffer = BulkyBazaarOffer<BazaarHeistItem>

// FILTER TYPES

/** FilterField implementation for the heist category */
export type HeistFilterField = BulkyFilterFieldBase<typeof CATEGORY.HEIST> & {
	type: HeistType
	tier: HeistTier
}

/** Filter implementation for the heist category */
export type HeistFilter = BulkyFilter<HeistFilterField>
