import {
	Compass,
	CompassFilter,
	CompassFilterField,
	CompassListing,
	SextantModifier,
	SextantType,
} from '@web/categories/compass/compass.types'
import { League } from './poe.types'
import { ObjectValues, OptionalRecord, PartialRecord, Uuid } from './utitlity.types'
import {
	Essence,
	EssenceFilter,
	EssenceFilterField,
	EssenceListing,
	EssenceTier,
	EssenceType,
} from '@web/categories/essence/essence.types'

// APP STATE TYPES

export const CATEGORY = {
	UNSUPPORTED: 'UNSUPPORTED',
	COMPASS: 'COMPASS',
	SCARAB: 'SCARAB',
	ESSENCE: 'ESSENCE',
	DELI_ORB: 'DELI_ORB',
	CONQ_MAP: 'CONQ_MAP',
} as const

export type Category = ObjectValues<typeof CATEGORY>

export type MainView = 'BUY' | 'SELL' | 'CONFIG'

// GENERIC FILTER ARGUMENTS, extend these with other categories later
export type FilterField = CompassFilterField | EssenceFilterField
export type FilterMainOption = SextantModifier | EssenceType
export type FilterSecondaryOption = SextantType | EssenceTier
export type Filter = CompassFilter | EssenceFilter

// FILTER TYPES

export type GenericFilterField<T extends FilterField, M extends FilterMainOption, S extends FilterSecondaryOption> = {
	uuid: Uuid<T>
	mainOption: M
	secondaryOption: S
	quantity: number
	maxBuyout: number
}

export type GenericFilter<T extends Filter, FilterField> = {
	uuid: Uuid<T>
	name: string
	multiplier: number
	fullBuyout: boolean
	alwaysMaxQuantity: boolean
	fields: FilterField[]
}

export type AnyFilter = GenericFilter<Filter, GenericFilterField<FilterField, FilterMainOption, FilterSecondaryOption>>

// GENERIC LISTING ARGUMENTS, extend these with other categories later
export type ListingType = CompassListing | EssenceListing
export type ItemType = SextantModifier | EssenceType
export type Item = Compass | Essence

// GENERIC LISTING TYPES

export type GenericListingItem<T extends object = {}> = {
	quantity: number
	price: number
} & T

export type GenericListing<ListingType extends OptionalRecord, ItemType extends string, Item extends object> = {
	uuid: Uuid<ListingType>
	ign: string
	league: League
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: number
	messageSent: boolean
	items: PartialRecord<ItemType, GenericListingItem<Item>[]>
}

export type AnyListing = GenericListing<ListingType, ItemType, GenericListingItem<Item>>

// DISPLAY TYPES

export type TotalPrice = { chaos: number; divine: number }

export type ComputedItemDisplayValues = {
	name: string
	secondaryOption: string
	quantity: number
	price: number
	stock: number
}

export type ComputedListingDisplayValues = {
	uuid: Uuid<AnyListing>
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
