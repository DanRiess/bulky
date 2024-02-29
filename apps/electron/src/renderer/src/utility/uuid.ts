/**
 * This component provides static functions to generate / validate branded uuids.
 */

import { CompassFilter, CompassListing } from '@web/categories/compass/compass.types'
import { useCompassStore } from '@web/categories/compass/compassStore'
import { useCompassFilterStore } from '@web/categories/compass/compassFilterStore'
import { InvalidUuidError } from '@web/errors/invalidUuid'
import { OptionalRecord, Uuid } from '@web/types/utitlity.types'
import { v4 as uuidv4, validate } from 'uuid'

/** Generate a uuid with the provided type as a brand. */
function getTypedUuid<T extends OptionalRecord = undefined>(uuid: string) {
	return uuid as Uuid<T>
}

/** Validate if a string is a uuid. */
function validateUuid(maybeUuid: string) {
	const uuidTest = maybeUuid.replace('{', '').replace('}', '')
	if (!validate(uuidTest)) {
		throw new InvalidUuidError()
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
	const compassStore = useCompassStore()
	return !!compassStore.listings[uuid]
}

/** Validate if a given string is a compass filter uuid */
function isCompassFilterUuid(uuid: string): uuid is Uuid<CompassFilter> {
	const compassFilterStore = useCompassFilterStore()
	return !!compassFilterStore.filters[uuid]
}

export const BULKY_UUID = {
	generateTypedUuid,
	isCompassListingUuid,
	isCompassFilterUuid,
}
