import { Essence, EssenceFilterField } from '@web/categories/essence/essence.types'
import { ObjectValues, PartialRecord, Uuid } from './utility.types'

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
	type: string
	quantity: number
	price: number
	priceOverride: number
	league: string
}

/**
 * A collection of every implementation of BulkyItemBase throughout the app.
 * This will be used as a generic type argument for every higher level type.
 *
 * @example
 * type BulkyOffer<T extends BulkyItem = BulkyItem> = {
 * 		offerProps: offerValues
 * }
 */
export type BulkyItem = Essence

/** Type that bulky items will be saved as */
export type BulkyItemRecord = PartialRecord<BulkyItem['type'], BulkyItem[]>

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
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: number
	fullBuyout: boolean
	items: T[]
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
export type BulkyPriceOverrideItem<T extends BulkyItem = BulkyItem> = {
	category: T['category']
	type: T['type']
	tier: T['tier']
	league: string
	priceOverride: number
}

/**
 * Structures overrides in object form.
 * The key is the item type, the value is an array of this item type's available tiers.
 *
 * @example
 * const essenceOverrideRecord = {
 * 	DREAD: [
 * 		{...props: props, tier: 'DEAFENING'},
 * 		{...props: props, tier: 'SHRIEKING'}
 * 	]
 * }
 */
export type BulkyPriceOverrideRecord<T extends BulkyItem = BulkyItem> = Partial<
	Record<BulkyPriceOverrideItem<T>['type'], BulkyPriceOverrideItem<T>[]>
>

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
