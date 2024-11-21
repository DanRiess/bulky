import { ObjectValues } from '@shared/types/utility.types'
import { BEAST_TYPE } from './bestiary.const'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { useBestiaryOfferStore } from './bestiaryOffers.store'
import { useBestiaryFilterStore } from './bestiaryFilter.store'

// STORE TYPES
export type BestiaryOfferStore = ReturnType<typeof useBestiaryOfferStore>
export type BestiaryFilterStore = ReturnType<typeof useBestiaryFilterStore>

// ITEM TYPES

/** All possible bestiary base types */
export type BeastType = ObjectValues<typeof BEAST_TYPE>

/** Beasts don't have tiers, but the item structure expects one. */
export type BeastTier = '0'

/** BulkyShopItem implementation of the Beastiary category */
export type ShopBeast = BulkyShopItemBase<typeof CATEGORY.BESTIARY> & {
	type: BeastType
	tier: BeastTier
}

/** BulkyBazaarItem implementation of the bestiary category */
export type BazaarBeast = BulkyBazaarItemBase<typeof CATEGORY.BESTIARY> & {
	type: BeastType
	tier: BeastTier
	price: number
}

/** BulkyBazaarOffer implementation for the bestiary category */
export type BazaarBestiaryOffer = BulkyBazaarOffer<BazaarBeast>

// FILTER TYPES

/** FilterField implementation for the bestiary category */
export type BestiaryFilterField = BulkyFilterFieldBase<typeof CATEGORY.BESTIARY> & {
	type: BeastType
	tier: BeastTier
}

/** Filter implementation for the bestiary category */
export type BestiaryFilter = BulkyFilter<BestiaryFilterField>
