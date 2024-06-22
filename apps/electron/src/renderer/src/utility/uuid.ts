/**
 * This component provides static functions to generate / validate branded uuids.
 */

import { OptionalRecord, Uuid } from '@shared/types/utility.types'
import { v4 as uuidv4, validate } from 'uuid'
import { ShopEssence } from '@web/categories/essence/essence.types'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { BulkyShopOffer } from '@shared/types/bulky.types'

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
function isEssenceOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopEssence>> {
	const essenceListingStore = useEssenceOfferStore()
	return !!essenceListingStore.offers.has(uuid)
}

/** Validate if a given string is a compass filter uuid */
function isEssenceFilterUuid(uuid: string): uuid is Uuid<EssenceFilter> {
	const essenceFilterStore = useEssenceFilterStore()
	return !!essenceFilterStore.filters.has(uuid)
}

export const BULKY_UUID = {
	generateTypedUuid,
	isEssenceOfferUuid,
	isEssenceFilterUuid,
}
