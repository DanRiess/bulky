/** define types for essence listings here */

import { GenericFilter, GenericFilterField, GenericListing, GenericListingItem } from '@web/types/bulky.types'
import { ObjectValues, Uuid } from '@web/types/utitlity.types'
import { ESSENCE_TIER, ESSENCE_TYPE } from './essence.const'

// MAIN AND SECONDARY OPTION TYPES

/** main option type */
export type EssenceType = ObjectValues<typeof ESSENCE_TYPE>

/** secondary option type */
export type EssenceTier = ObjectValues<typeof ESSENCE_TIER>

// LISTING TYPES

/** extend the generic to include essence specific data */
export type Essence = GenericListingItem<{ tier: EssenceTier }>

/** narrow the generic listing to the essence type */
export interface EssenceListing extends GenericListing<EssenceListing, EssenceType, Essence> {}

/** defines the map that is used as state in the essence store */
export type EssenceListings = Map<Uuid<EssenceListing>, EssenceListing>

// FILTER TYPES

/** narrow the generic filter field to the compass type */
export interface EssenceFilterField extends GenericFilterField<EssenceFilterField, EssenceType, EssenceTier> {}

/** narrow the generic filter to the compass type */
export interface EssenceFilter extends GenericFilter<EssenceFilter, EssenceFilterField> {}

/** defines the map that is used as state in the filter store */
export type EssenceFilters = Map<Uuid<EssenceFilter>, EssenceFilter>
