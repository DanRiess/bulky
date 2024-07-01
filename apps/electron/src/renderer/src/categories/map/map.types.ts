import { ObjectValues } from '@shared/types/utility.types'
import { MAP_TIER, MAP_TYPE } from './map.const'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { useNormalMapOfferStore } from './normalMapOffers.store'
import { useNormalMapFilterStore } from './normalMapFilter.store'

// STORE TYPES
export type NormalMapOfferStore = ReturnType<typeof useNormalMapOfferStore>
export type NormalMapFilterStore = ReturnType<typeof useNormalMapFilterStore>

// ITEM TYPES

/** All possible map base types. */
export type MapType = ObjectValues<typeof MAP_TYPE>

/** All possible map tiers. */
export type MapTier = ObjectValues<typeof MAP_TIER>

/** BulkyShopItem implementation for the map category */
export type ShopMap = BulkyShopItemBase<typeof CATEGORY.MAP> & {
	type: MapType
	tier: MapTier
}

/** BulkyBazaarItem implementation for the map category */
export type BazaarMap = BulkyBazaarItemBase<typeof CATEGORY.MAP> & {
	type: MapType
	tier: MapTier
}

/** BulkyBazaarOffer implementation for the map category */
export type BazaarMapOffer = BulkyBazaarOffer<BazaarMap>

// FILTER TYPES

/** FilterField implementation for the map category */
export type MapFilterField = BulkyFilterFieldBase<typeof CATEGORY.MAP> & {
	type: MapType
	tier: MapTier
}

/** Filter implementation for the map category */
export type MapFilter = BulkyFilter<MapFilterField>
