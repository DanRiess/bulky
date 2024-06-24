import { ObjectValues } from '@shared/types/utility.types'
import { SCARAB_TYPE } from './scarab.const'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { useScarabOfferStore } from './scarabOffers.store'
import { useScarabFilterStore } from './scarabFilter.store'

// STORE TYPES
export type ScarabOfferStore = ReturnType<typeof useScarabOfferStore>
export type ScarabFilterStore = ReturnType<typeof useScarabFilterStore>

// ITEM TYPES

/** All possible scarab base types */
export type ScarabType = ObjectValues<typeof SCARAB_TYPE>

/** Scarabs don't have tiers, but the item structure expects one. */
export type ScarabTier = '0'

/** BulkyShopItem implementation for the scarab category */
export type ShopScarab = BulkyShopItemBase<typeof CATEGORY.SCARAB> & {
	type: ScarabType
	tier: ScarabTier
}

/** BulkyBazaarItem implementation for the scarab category */
export type BazaarScarab = BulkyBazaarItemBase<typeof CATEGORY.SCARAB> & {
	type: ScarabType
	tier: ScarabTier
}

/** BulkyBazaarOffer implementation for the scarab category */
export type BazaarScarabOffer = BulkyBazaarOffer<BazaarScarab>

// FILTER TYPES

/** FilterField implementation for the scarab category */
export type ScarabFilterField = BulkyFilterFieldBase<typeof CATEGORY.SCARAB> & {
	type: ScarabType
	tier: ScarabTier
}

/** Filter implementation for the scarab category */
export type ScarabFilter = BulkyFilter<ScarabFilterField>
