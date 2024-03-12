import {
	Compass,
	CompassFilter,
	CompassFilterField,
	CompassFilterStore,
	CompassListing,
	CompassListingStore,
	SextantModifier,
	SextantType,
} from '@web/categories/compass/compass.types'
import { League } from './poe.types'
import { ObjectValues, OptionalRecord, PartialRecord, Uuid } from './utitlity.types'
import {
	Essence,
	EssenceFilter,
	EssenceFilterField,
	EssenceFilterStore,
	EssenceListing,
	EssenceListingStore,
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

// GENERIC STORES
export type GenericListingStore = CompassListingStore | EssenceListingStore
export type GenericFilterStore = CompassFilterStore | EssenceFilterStore

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
export type ItemTier = SextantType | EssenceTier | undefined
export type Item = Compass | Essence

// GENERIC LISTING TYPES

export type GenericItemData<T extends ItemTier = undefined> = {
	quantity: number
	price: number
	tier: T
}

export type GenericListingItem<TType extends ItemType, TTier extends ItemTier> = PartialRecord<TType, GenericItemData<TTier>[]>

export type GenericListing<ListingType extends OptionalRecord, TType extends ItemType, TTier extends ItemTier> = {
	uuid: Uuid<ListingType>
	ign: string
	league: League
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: number
	messageSent: boolean
	items: GenericListingItem<TType, TTier>
}

export type AnyListing = GenericListing<ListingType, ItemType, ItemTier>

export type GenericListings<TListing extends AnyListing> = Map<Uuid<TListing>, TListing>

export type AnyListings = GenericListings<ListingType>

// DISPLAY TYPES

export type TotalPrice = { chaos: number; divine: number }

export type ComputedItemDisplayValues = {
	name: string
	secondaryOption?: string
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
