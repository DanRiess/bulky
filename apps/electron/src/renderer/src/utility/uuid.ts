/**
 * This component provides static functions to generate / validate branded uuids.
 */

import { CompassFilter, CompassListing } from '@web/categories/compass/compass.types'
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'
import { useCompassFilterStore } from '@web/categories/compass/compassFilter.store'
import { OptionalRecord, Uuid } from '@web/types/utitlity.types'
import { v4 as uuidv4, validate } from 'uuid'
import { EssenceFilter, EssenceListing } from '@web/categories/essence/essence.types'
import { useEssenceListingStore } from '@web/categories/essence/essenceListing.store'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'

/** Generate a uuid with the provided type as a brand. */
function getTypedUuid<T extends OptionalRecord = undefined>(uuid: string) {
	return uuid as Uuid<T>
}

/** Validate if a string is a uuid. */
function validateUuid(maybeUuid: string) {
	const uuidTest = maybeUuid.replace('{', '').replace('}', '')
	if (!validate(uuidTest)) {
		return uuidv4()
	}
	return maybeUuid
}

// GENERATOR

function generateTypedUuid<T extends OptionalRecord = undefined>(maybeUuid?: string) {
	const uuid = maybeUuid ? validateUuid(maybeUuid) : uuidv4()
	return getTypedUuid<T>(uuid)
}

// VALIDATORS

/** Validate if a given string is a compass listing uuid. */
function isCompassListingUuid(uuid: string): uuid is Uuid<CompassListing> {
	const compassListingStore = useCompassListingStore()
	return !!compassListingStore.listings.has(uuid)
}

/** Validate if a given string is a compass filter uuid */
function isCompassFilterUuid(uuid: string): uuid is Uuid<CompassFilter> {
	const compassFilterStore = useCompassFilterStore()
	return !!compassFilterStore.filters.has(uuid)
}

/** Validate if a given string is a compass listing uuid. */
function isEssenceListingUuid(uuid: string): uuid is Uuid<EssenceListing> {
	const essenceListingStore = useEssenceListingStore()
	return !!essenceListingStore.listings.has(uuid)
}

/** Validate if a given string is a compass filter uuid */
function isEssenceFilterUuid(uuid: string): uuid is Uuid<EssenceFilter> {
	const essenceFilterStore = useEssenceFilterStore()
	return !!essenceFilterStore.filters.has(uuid)
}

export const BULKY_UUID = {
	generateTypedUuid,
	isCompassListingUuid,
	isCompassFilterUuid,
	isEssenceListingUuid,
	isEssenceFilterUuid,
}
