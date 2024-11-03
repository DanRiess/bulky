import { ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { FRAGMENT_TYPE } from './fragment.const'
import { useFragmentOfferStore } from './fragmentOffers.store'
import { useFragmentFilterStore } from './fragmentFilter.store'

// STORE TYPES
export type FragmentOfferStore = ReturnType<typeof useFragmentOfferStore>
export type FragmentFilterStore = ReturnType<typeof useFragmentFilterStore>

// ITEM TYPES

/** All possible fragment base types */
export type FragmentType = ObjectValues<typeof FRAGMENT_TYPE>

/** Fragments don't have tiers, but the item structure expects one. */
export type FragmentTier = '0'

/** BulkyShopItem implementation of the fragment category */
export type ShopFragment = BulkyShopItemBase<typeof CATEGORY.FRAGMENT> & {
	type: FragmentType
	tier: FragmentTier
}

/** BulkyBazaarItem implementation of the fragment category */
export type BazaarFragment = BulkyBazaarItemBase<typeof CATEGORY.FRAGMENT> & {
	type: FragmentType
	tier: FragmentTier
	price: number
}

/** BulkyBazaarOffer implementation for the fragment category */
export type BazaarFragmentOffer = BulkyBazaarOffer<BazaarFragment>

// FILTER TYPES

/** FilterField implementation for the fragment category */
export type FragmentFilterField = BulkyFilterFieldBase<typeof CATEGORY.FRAGMENT> & {
	type: FragmentType
	tier: FragmentTier
}

/** Filter implementation for the fragment category */
export type FragmentFilter = BulkyFilter<FragmentFilterField>
