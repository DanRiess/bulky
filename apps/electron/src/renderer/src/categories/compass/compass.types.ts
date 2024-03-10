/** define types for compass listings here */

import { GenericFilter, GenericFilterField, GenericListing, GenericListingItem } from '@web/types/bulky.types'
import { ObjectValues, Uuid } from '@web/types/utitlity.types'
import { SEXTANT_MODIFIER, SEXTANT_TYPE } from './compass.const'

// MAIN AND SECONDARY OPTION TYPES
/** main option type */
export type SextantModifier = ObjectValues<typeof SEXTANT_MODIFIER>

/** secondary option type */
export type SextantType = ObjectValues<typeof SEXTANT_TYPE>

// LISTING TYPES

/** extend the generic to include compass specific data */
export type Compass = GenericListingItem & { type: SextantType }

/** narrow the generic listing to the compass type */
export interface CompassListing extends GenericListing<CompassListing, SextantModifier, Compass> {}

/** defines the map that is used as state in the compass store */
export type CompassListings = Map<Uuid<CompassListing>, CompassListing>

// FILTER TYPES

/** narrow the generic filter field to the compass type */
export interface CompassFilterField extends GenericFilterField<CompassFilterField, SextantModifier, SextantType> {}

/** narrow the generic filter to the compass type */
export interface CompassFilter extends GenericFilter<CompassFilter, CompassFilterField> {}

/** defines the map that is used as state in the filter store */
export type CompassFilters = Map<Uuid<CompassFilter>, CompassFilter>
