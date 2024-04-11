/** define types for essence listings here */

import {
	GenericFilter,
	GenericFilterField,
	GenericItemData,
	GenericListing,
	GenericListingItems,
	GenericListings,
} from '@shared/types/bulky.types'
import { ObjectValues, Uuid } from '@shared/types/utility.types'
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'
import { useEssenceListingStore } from './essenceListing.store'
import { useEssenceFilterStore } from './essenceFilter.store'

// STORE TYPES

export type EssenceListingStore = ReturnType<typeof useEssenceListingStore>
export type EssenceFilterStore = ReturnType<typeof useEssenceFilterStore>

// MAIN AND SECONDARY OPTION TYPES

/** main option type */
export type EssenceType = ObjectValues<typeof ESSENCE_TYPE>

/** secondary option type */
export type EssenceTier = ObjectValues<typeof ESSENCE_TIER>

// LISTING TYPES

/** extend the generic to include essence specific data */
export type Essence = GenericItemData<EssenceTier>

/** extend the generic to include essence specific data */
export type EssenceListingItems = GenericListingItems<EssenceType, EssenceTier>

/** narrow the generic listing to the essence type */
export interface EssenceListing extends GenericListing<EssenceListing, EssenceListingItems> {}

/** defines the map that is used as state in the essence store */
export type EssenceListings = GenericListings<EssenceListing>

// FILTER TYPES

/** narrow the generic filter field to the compass type */
export interface EssenceFilterField extends GenericFilterField<EssenceFilterField, EssenceType, EssenceTier> {}

/** narrow the generic filter to the compass type */
export interface EssenceFilter extends GenericFilter<EssenceFilter, EssenceFilterField> {}

/** defines the map that is used as state in the filter store */
export type EssenceFilters = Map<Uuid<EssenceFilter>, EssenceFilter>
