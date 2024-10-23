import { ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { CATALYST_TYPE } from './catalyst.const'
import { useCatalystOfferStore } from './catalystOffers.store'
import { useCatalystFilterStore } from './catalystFilter.store'

// STORE TYPES
export type CatalystOfferStore = ReturnType<typeof useCatalystOfferStore>
export type CatalystFilterStore = ReturnType<typeof useCatalystFilterStore>

// ITEM TYPES

/** All possible catalyst base types */
export type CatalystType = ObjectValues<typeof CATALYST_TYPE>

/** Catalysts don't have tiers, but the item structure expects one. */
export type CatalystTier = '0'

/** BulkyShopItem implementation of the catalyst category */
export type ShopCatalyst = BulkyShopItemBase<typeof CATEGORY.CATALYST> & {
	type: CatalystType
	tier: CatalystTier
}

/** BulkyBazaarItem implementation of the catalyst category */
export type BazaarCatalyst = BulkyBazaarItemBase<typeof CATEGORY.CATALYST> & {
	type: CatalystType
	tier: CatalystTier
	price: number
}

/** BulkyBazaarOffer implementation for the catalyst category */
export type BazaarCatalystOffer = BulkyBazaarOffer<BazaarCatalyst>

// FILTER TYPES

/** FilterField implementation for the catalyst category */
export type CatalystFilterField = BulkyFilterFieldBase<typeof CATEGORY.CATALYST> & {
	type: CatalystType
	tier: CatalystTier
}

/** Filter implementation for the catalyst category */
export type CatalystFilter = BulkyFilter<CatalystFilterField>
