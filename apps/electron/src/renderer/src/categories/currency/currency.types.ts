import { ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
} from '@shared/types/bulky.types'
import { CURRENCY_TYPE } from './currency.const'
import { useCurrencyOfferStore } from './currencyOffers.store'
import { useCurrencyFilterStore } from './currencyFilter.store'

// STORE TYPES
export type CurrencyOfferStore = ReturnType<typeof useCurrencyOfferStore>
export type CurrencyFilterStore = ReturnType<typeof useCurrencyFilterStore>

// ITEM TYPES

/** All possible currency base types */
export type CurrencyType = ObjectValues<typeof CURRENCY_TYPE>

/** Currencys don't have tiers, but the item structure expects one. */
export type CurrencyTier = '0'

/** BulkyShopItem implementation of the currency category */
export type ShopCurrency = BulkyShopItemBase<typeof CATEGORY.CURRENCY> & {
	type: CurrencyType
	tier: CurrencyTier
}

/** BulkyBazaarItem implementation of the currency category */
export type BazaarCurrency = BulkyBazaarItemBase<typeof CATEGORY.CURRENCY> & {
	type: CurrencyType
	tier: CurrencyTier
	price: number
}

/** BulkyBazaarOffer implementation for the currency category */
export type BazaarCurrencyOffer = BulkyBazaarOffer<BazaarCurrency>

// FILTER TYPES

/** FilterField implementation for the currency category */
export type CurrencyFilterField = BulkyFilterFieldBase<typeof CATEGORY.CURRENCY> & {
	type: CurrencyType
	tier: CurrencyTier
}

/** Filter implementation for the currency category */
export type CurrencyFilter = BulkyFilter<CurrencyFilterField>
