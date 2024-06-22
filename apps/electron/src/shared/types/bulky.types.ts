import { Essence, EssenceFilterField } from '@web/categories/essence/essence.types'
import { MaybeComputedRef, ObjectValues, Uuid } from './utility.types'
import { ComputedRef, UnwrapRef } from 'vue'
import { Scarab } from '@web/categories/scarab/scarab.types'
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

// BULKY ITEM TYPES

/**
 * Generic type that needs to be extended to make sense. This is done in the categories' type files.
 *
 * @example
 * type Essence = BulkyItemBase<typeof CATEGORY.ESSENCE> & {
 *		type: EssenceType
 *		tier: EssenceTier
 *	}
 */
export type BulkyItemBase<T extends Category> = {
	category: T
	name: string
	type: string // will be overridden
	quantity: number
	price: MaybeComputedRef<number>
	priceOverride: ComputedRef<number>
	icon: string
	league: string
	selected: MaybeComputedRef<boolean>
}

/**
 * A collection of every implementation of BulkyItemBase throughout the app.
 * This will be used as a generic type argument for every higher level type.
 */
export type BulkyItem = Essence | Scarab

/** Type that bulky items will be saved as */
// export type BulkyItemRecord = PartialRecord<BulkyItem['type'], BulkyItem[]>
export type BulkyItemRecord = Map<`${BulkyItem['type']}_${BulkyItem['tier']}`, BulkyItem>

/**
 * A BulkyOffer contains all necessary offer metadata as well as the items contained within the offer.
 * This type can be used as a generic type argument or to instantiate a type-safe offer.
 *
 * @example
 * const essenceOffer: BulkyOffer<Essence> = {
 * 		metadata: metadata
 * 		items: Essence[] // will throw if any item other than an essence is pushed
 * }
 */
export type BulkyOffer<T extends BulkyItem = BulkyItem> = {
	uuid: Uuid<BulkyOffer<T>>
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
type BulkyFilterField = EssenceFilterField

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

// PRICES

/**
 * Price overrides are being saved separately. This is why this type needs to have all of
 * the additional metadata.
 */
export type BulkyItemOverrideInstance<T extends BulkyItem = BulkyItem> = {
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
export type BulkyItemOverrideRecord<T extends BulkyItem = BulkyItem> = Map<
	`${T['type']}_${T['tier']}`,
	BulkyItemOverrideInstance<T>
>

/**
 * Properties in a BulkyItem that can be overwritten and saved to the DB.
 * This type serves as a function argument mostly.
 */
export type BulkyItemOverrideOptions = {
	price?: number
	selected?: boolean
}

export type TotalPrice = { chaos: number; divine: number }

// DISPLAY TYPES

export type ComputedItemDisplayValues = {
	name: string
	secondaryOption?: string
	quantity: number
	price: number
	stock: number
}

export type ComputedOfferDisplayValues = {
	uuid: Uuid<BulkyOffer>
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
