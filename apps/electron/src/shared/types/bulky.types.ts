import {
	ShopEssence,
	BazaarEssence,
	EssenceFilterField,
	EssenceFilterStore,
	EssenceOfferStore,
} from '@web/categories/essence/essence.types'
import { MaybeComputedRef, ObjectValues, Uuid, getKeys } from './utility.types'
import { ComputedRef, UnwrapRef } from 'vue'
import {
	BazaarScarab,
	ScarabFilterField,
	ScarabFilterStore,
	ScarabOfferStore,
	ShopScarab,
} from '@web/categories/scarab/scarab.types'
import { PoeStashTab } from './poe.types'
import {
	BazaarDeliriumOrb,
	DeliriumOrbFilterField,
	DeliriumOrbFilterStore,
	DeliriumOrbOfferStore,
	ShopDeliriumOrb,
} from '@web/categories/deliriumOrb/deliriumOrb.types'
import { BazaarMap, MapFilterField, NormalMapFilterStore, NormalMapOfferStore, ShopMap } from '@web/categories/map/map.types'

// APP STATE TYPES

// export const CATEGORY = {
// 	UNSUPPORTED: 'UNSUPPORTED',
// 	COMPASS: 'COMPASS',
// 	SCARAB: 'SCARAB',
// 	ESSENCE: 'ESSENCE',
// 	DELI_ORB: 'DELI_ORB',
// 	CONQ_MAP: 'CONQ_MAP',
// } as const

// DO NOT CHANGE THE ORDER
export const CATEGORY = {
	ESSENCE: 'ESSENCE',
	SCARAB: 'SCARAB',
	DELIRIUM_ORB: 'DELIRIUM_ORB',
	MAP: 'MAP',
} as const

export const CATEGORY_IDX_TO_NAME = getKeys(CATEGORY)
export const CATEGORY_NAME_TO_IDX = CATEGORY_IDX_TO_NAME.reduce((prev, curr, idx) => {
	prev[curr] = idx
	return prev
}, {} as Record<keyof typeof CATEGORY, number>)

export type Category = ObjectValues<typeof CATEGORY>

type BulkyItemOptions = {
	prefix: string[]
	suffix: string[]
}

// STORES
export type BulkyOfferStore = EssenceOfferStore | ScarabOfferStore | DeliriumOrbOfferStore | NormalMapOfferStore
export type BulkyFilterStore = EssenceFilterStore | ScarabFilterStore | DeliriumOrbFilterStore | NormalMapFilterStore

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
export type BulkyShopItem = ShopEssence | ShopScarab | ShopDeliriumOrb | ShopMap

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
	/**
	 * Do not change this type to a number.
	 * While more consistent, when the offer updates, chaosPerDiv updates as well.
	 * However, the user would expect that his minimum buyout stays the same.
	 * We'd have to watch for cpd changes and do unnecessarily complex recalculations.
	 */
	minimumBuyout: TotalPrice
	fullBuyout: boolean
	items: UnwrapRef<T>[]
	fullPrice: number
	lastUploaded: number
	active: boolean
	autoSync: boolean
}

// BULKY BAZAAR ITEM TYPES

export type BulkyBazaarItemBase<T extends Category> = {
	category: T
	name: string
	type: string // will be overridden
	tier: string
	options?: BulkyItemOptions
	quantity: number
	price: number
	/** The actual url, not the /data/static id. */
	icon: string
}

export type BulkyBazaarItem = BazaarEssence | BazaarScarab | BazaarDeliriumOrb | BazaarMap

export type BulkyBazaarItemRecord<T extends BulkyBazaarItem = BulkyBazaarItem> = Map<`${T['type']}_${T['tier']}`, T>

export type BulkyBazaarOffer<T extends BulkyBazaarItem = BulkyBazaarItem> = {
	uuid: Uuid<BulkyBazaarOffer<T>>
	category: T['category']
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	fullPrice: number
	minimumBuyout: number
	items: T[]
	contact: {
		messageSent: boolean
		timestamp: number
	}
}

/**
 * This type will be generated on demand to be passed down to components.
 * Depending on the category (and at a later stage depending on the filter name as well),
 * it will choose a filter from the correct store and computed utility functions around it.
 */
export type ComputedBulkyOfferStore = {
	offers: BulkyOfferStore['offers']
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
}

/**
 * A collection of every implementation of BulkyFilterFieldBase throughout the app.
 */
export type BulkyFilterField = EssenceFilterField | ScarabFilterField | DeliriumOrbFilterField | MapFilterField

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
	uuid: Uuid<BulkyFilter<T>>
	category: T['category']
	name: string
	multiplier: number
	fullBuyout: boolean
	alwaysMaxQuantity: boolean
	fields: T[]
}

/**
 * This type will be generated on demand to be passed down to components.
 * Depending on the category (and at a later stage depending on the filter name as well),
 * it will choose a filter from the correct store and computed utility functions around it.
 */
export type ComputedBulkyFilterStore = {
	filter: BulkyFilter
	filterFieldTypeOptions: BulkyFilterField['type'][]
	filterFieldTierOptions: BulkyFilterField['tier'][]
	addFilterField: <T extends BulkyFilter['uuid']>(uuid: T) => void
	removeFilterField: <T extends BulkyFilter['uuid']>(uuid: T, idx: number) => void
}

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

export type BulkyBazaarItemDto = {
	type: number
	tier: number
	opt?: Record<string, number[]>
	qnt: number
	prc: number
}

export type BulkyBazaarOfferDto = {
	uuid: string
	timestamp: number
	account: string
	ign: string
	category: string
	league: string
	chaosPerDiv: number
	multiplier: number
	fullPrice: number
	minimumBuyout: number
	fullBuyout: boolean
	// items: string // base64 encoded binary
	items: BulkyBazaarItemDto[]
}

// UTILITY TYPES

export type BulkyItemSortOptions = {
	key: 'NAME' | 'TIER' | 'QUANT' | 'PRICE' | 'STACKPRICE'
	direction: 'ASC' | 'DESC'
}
