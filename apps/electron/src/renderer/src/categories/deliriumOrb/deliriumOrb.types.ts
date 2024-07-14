import { ObjectValues } from '@shared/types/utility.types'
import { DELI_ORB_TYPE } from './deliriumOrb.const'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { useDeliriumOrbOfferStore } from './deliriumOrbOffer.store'
import { useDeliriumOrbFilterStore } from './deliriumOrbFilter.store'

// STORE TYPES
export type DeliriumOrbOfferStore = ReturnType<typeof useDeliriumOrbOfferStore>
export type DeliriumOrbFilterStore = ReturnType<typeof useDeliriumOrbFilterStore>

// ITEM TYPES

/** All possible delirium base types */
export type DeliriumOrbType = ObjectValues<typeof DELI_ORB_TYPE>

/** Delirium orbs don't have tiers, but the item structure expects one. */
export type DeliriumOrbTier = '0'

/** BulkyShopItem implementation of the delirium orb category */
export type ShopDeliriumOrb = BulkyShopItemBase<typeof CATEGORY.DELIRIUM_ORB> & {
	type: DeliriumOrbType
	tier: DeliriumOrbTier
}

/** BulkyBazaarItem implementation of the delirium orb category */
export type BazaarDeliriumOrb = BulkyBazaarItemBase<typeof CATEGORY.DELIRIUM_ORB> & {
	type: DeliriumOrbType
	tier: DeliriumOrbTier
	price: number
}

/** BulkyBazaarOffer implementation for the delirium orb category */
export type BazaarDeliriumOrbOffer = BulkyBazaarOffer<BazaarDeliriumOrb>

// FILTER TYPES

/** FilterField implementation for the delirium orb category */
export type DeliriumOrbFilterField = BulkyFilterFieldBase<typeof CATEGORY.DELIRIUM_ORB> & {
	type: DeliriumOrbType
	tier: DeliriumOrbTier
}

/** Filter implementation for the delirium orb category */
export type DeliriumOrbFilter = BulkyFilter<DeliriumOrbFilterField>
