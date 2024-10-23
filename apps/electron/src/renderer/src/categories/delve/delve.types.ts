import { ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { DELVE_TYPE } from './delve.const'
import { useDelveOfferStore } from './delveOffers.store'
import { useDelveFilterStore } from './delveFilter.store'

// STORE TYPES
export type DelveOfferStore = ReturnType<typeof useDelveOfferStore>
export type DelveFilterStore = ReturnType<typeof useDelveFilterStore>

// ITEM TYPES

/** All possible delve base types */
export type DelveType = ObjectValues<typeof DELVE_TYPE>

/** Fossils and resonators don't have tiers, but the item structure expects one. */
export type DelveTier = '0'

/** BulkyShopItem implementation of the delve category */
export type ShopDelveItem = BulkyShopItemBase<typeof CATEGORY.DELVE> & {
	type: DelveType
	tier: DelveTier
}

/** BulkyBazaarItem implementation of the delve category */
export type BazaarDelveItem = BulkyBazaarItemBase<typeof CATEGORY.DELVE> & {
	type: DelveType
	tier: DelveTier
	price: number
}

/** BulkyBazaarOffer implementation for the delve category */
export type BazaarDelveOffer = BulkyBazaarOffer<BazaarDelveItem>

// FILTER TYPES

/** FilterField implementation for the delve category */
export type DelveFilterField = BulkyFilterFieldBase<typeof CATEGORY.DELVE> & {
	type: DelveType
	tier: DelveTier
}

/** Filter implementation for the delve category */
export type DelveFilter = BulkyFilter<DelveFilterField>
