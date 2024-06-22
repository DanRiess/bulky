import { ShopEssence, BazaarEssence, EssenceFilterField, EssenceFilterStore } from '@web/categories/essence/essence.types'
import { MaybeComputedRef, ObjectValues, Uuid } from './utility.types'
import { ComputedRef, UnwrapRef } from 'vue'
import { BazaarScarab, ShopScarab } from '@web/categories/scarab/scarab.types'
import { PoeStashTab } from './poe.types'

// APP STATE TYPES

// export const CATEGORY = {
// 	UNSUPPORTED: 'UNSUPPORTED',
// 	COMPASS: 'COMPASS',
// 	SCARAB: 'SCARAB',
// 	ESSENCE: 'ESSENCE',
// 	DELI_ORB: 'DELI_ORB',
// 	CONQ_MAP: 'CONQ_MAP',
// } as const

export const CATEGORY = {
	ESSENCE: 'ESSENCE',
	SCARAB: 'SCARAB',
} as const

export type Category = ObjectValues<typeof CATEGORY>

type BulkyItemOptions = {
	prefix: string[]
	suffix: string[]
}

// BULKY SHOP ITEM TYPES

/**
 * Generic type that needs to be extended to make sense. This is done in the categories' type files.
 *
 * @example
 * type ShopEssence = BulkyShopItemBase<typeof CATEGORY.ESSENCE> & {
 *		type: EssenceType
 *		tier: EssenceTier
 *	}
 */
export type BulkyShopItemBase<T extends Category> = {
	category: T
	name: string
	type: string // will be overridden
	options?: BulkyItemOptions
	quantity: number
	price: MaybeComputedRef<number>
	priceOverride: ComputedRef<number>
	icon: string
	league: string
	selected: MaybeComputedRef<boolean>
}

/**
 * A collection of every implementation of BulkyShopItemBase throughout the app.
 * This will be used as a generic type argument for every higher level type.
 */
export type BulkyShopItem = ShopEssence | ShopScarab

/** Type that bulky items will be saved as */
export type BulkyShopItemRecord<T extends BulkyShopItem = BulkyShopItem> = Map<`${T['type']}_${T['tier']}`, T>

/**
 * A BulkyShopOffer contains all necessary offer metadata as well as the items contained within the offer.
 * This type can be used as a generic type argument or to instantiate a type-safe offer.
 *
 * @example
 * const essenceOffer: BulkyShopOffer<ShopEssence> = {
 * 		metadata: metadata
 * 		items: ShopEssence[] // will throw if any item other than an essence is pushed
 * }
 */
export type BulkyShopOffer<T extends BulkyShopItem = BulkyShopItem> = {
	uuid: Uuid<BulkyShopOffer<T>>
	user: string
	ign: string
	league: string
	category: T['category']
	stashTabIds: PoeStashTab['id'][]
	chaosPerDiv: number
	multiplier: number
	computedMultiplier: number
	minimumBuyout: {
		divine: number
		chaos: number
	}
	fullBuyout: boolean
	items: UnwrapRef<T>[]
	fullPrice: number
	lastUploaded: number
	active: boolean
	autoSync: boolean
}

// BULKY BAZAAR ITEM TYPES

export type BulkyBazaarItemBase = {
	type: string // will be overridden
	options?: BulkyItemOptions
	quantity: number
	price: number
	icon: string
}

export type BulkyBazaarItem = BazaarEssence | BazaarScarab

export type BulkyBazaarItemRecord<T extends BulkyBazaarItem = BulkyBazaarItem> = Map<`${T['type']}_${T['tier']}`, T>

export type BulkyBazaarOffer<T extends BulkyBazaarItem = BulkyBazaarItem> = {
	uuid: Uuid<BulkyBazaarOffer<T>>
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: {
		divine: number
		chaos: number
	}
	items: BulkyBazaarItemRecord<T>
	contact: {
		messageSent: boolean
		timestamp: number
	}
}

// FILTER TYPES

/**
 * Generic type that needs to be extended to make sense. This is done in the categories' type files.
 *
 * @example
 * type EssenceFilterField = BulkyFilterFieldBase<typeof CATEGORY.ESSENCE> & {
 *		type: EssenceType
 *		tier: EssenceTier
 *	}
 */
export type BulkyFilterFieldBase<T extends Category> = {
	uuid: Uuid<BulkyFilterFieldBase<T>>
	category: T
	type: string
	quantity: number
	maxBuyout: number
}

/**
 * A collection of every implementation of BulkyFilterFieldBase throughout the app.
 */
export type BulkyFilterField = EssenceFilterField

/**
 * A BulkyFilter contains all necessary filter metadata as well as the fields contained within the filter.
 * This type can be used as a generic type argument or to instantiate a type-safe filter.
 *
 * @example
 * const essenceFilter: BulkyFilter<EssenceFilterField> = {
 * 		...metadata: metadata
 * 		fields: EssenceFilterField[] // will throw if incorrect filter field is pushed
 * }
 */
export type BulkyFilter<T extends BulkyFilterField = BulkyFilterField> = {
	uuid: Uuid<T>
	name: string
	multiplier: number
	fullBuyout: boolean
	alwaysMaxQuantity: boolean
	fields: T[]
}

export type BulkyFilterStore = EssenceFilterStore

// PRICES

/**
 * Price overrides are being saved separately. This is why this type needs to have all of
 * the additional metadata.
 */
export type BulkyItemOverrideInstance<T extends BulkyShopItem = BulkyShopItem> = {
	category: T['category']
	type: T['type']
	tier: T['tier']
	league: string
	priceOverride: number
	selected: boolean
}

/**
 * Structures overrides in map form.
 * The key is the item type and item tier, the value is the item.
 *
 * @example
 * const essenceOverrideRecord = new Map({
 * 	'ZEAL_DEAFENING': EssenceItem
 * })
 */
export type BulkyItemOverrideRecord<T extends BulkyShopItem = BulkyShopItem> = Map<
	`${T['type']}_${T['tier']}`,
	BulkyItemOverrideInstance<T>
>

/**
 * Properties in a BulkyShopItem that can be overwritten and saved to the DB.
 * This type serves as a function argument mostly.
 */
export type BulkyItemOverrideOptions = {
	price?: number
	selected?: boolean
}

export type TotalPrice = { chaos: number; divine: number }

// DTO TYPES

export type BulkyBazaarOfferDto = {
	category: string
	uuid: string
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: {
		divine: number
		chaos: number
	}
	items: string
}

// DISPLAY TYPES

export type ComputedItemDisplayValues = {
	name: string
	secondaryOption?: string
	quantity: number
	price: number
	stock: number
}

export type ComputedOfferDisplayValues = {
	uuid: Uuid<BulkyShopOffer>
	ign: string
	chaosPerDiv: number
	computedItems: ComputedItemDisplayValues[]
	totalPrice: TotalPrice
	messageSent: boolean
	multiplier: number
	/**
	 * Proxy to filter.fullBuyout.
	 * Watch this to expand / collapse the listing's items when full buyout input gets toggled.
	 */
	fullBuyoutWatcher: boolean
}

// UTILITY TYPES

export type BulkyItemSortOptions = {
	key: 'NAME' | 'QUANT' | 'PRICE' | 'STACKPRICE'
	direction: 'ASC' | 'DESC'
}
