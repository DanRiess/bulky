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
	amount: number
	maxBuyout: number
}

export type GenericFilter<T extends Filter, FilterField> = {
	uuid: Uuid<T>
	name: string
	multiplier: number
	fullBuyout: boolean
	fields: FilterField[]
}

export type AnyFilter = GenericFilter<Filter, GenericFilterField<FilterField, FilterMainOption, FilterSecondaryOption>>

// GENERIC LISTING ARGUMENTS, extend these with other categories later
export type ListingType = CompassListing | EssenceListing
export type PayloadType = SextantModifier | EssenceType
export type PayloadItemType = Compass | Essence

// GENERIC LISTING TYPES

export type GenericListingPayloadItem<T extends object = {}> = {
	amount: number
	price: number
} & T

export type GenericListing<ListingType extends OptionalRecord, PayloadType extends string, PayloadItemType extends object> = {
	uuid: Uuid<ListingType>
	ign: string
	league: League
	chaosPerDiv: number
	multiplier: number
	minimumBuyout: number
	messageSent: boolean
	payload: PartialRecord<PayloadType, GenericListingPayloadItem<PayloadItemType>[]>
}

export type AnyListing = GenericListing<ListingType, PayloadType, GenericListingPayloadItem<PayloadItemType>>

// DISPLAY TYPES

export type TotalPrice = { chaos: number; divine: number }

export type FilteredPayloadDisplayItem = {
	name: string
	secondaryOption: string
	amount: number
	price: number
	stock: number
}

export type FilteredListingDisplayValues = {
	uuid: Uuid<AnyListing>
	ign: string
	chaosPerDiv: number
	filteredPayload: FilteredPayloadDisplayItem[]
	totalPrice: TotalPrice
	messageSent: boolean
	multiplier: number
	/**
	 * Proxy to filter.fullBuyout.
	 * Watch this to expand / collapse the listings payload when full buyout input gets toggled.
	 */
	fullBuyoutWatcher: boolean
}
