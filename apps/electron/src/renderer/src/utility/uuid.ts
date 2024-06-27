/**
 * This component provides static functions to generate / validate branded uuids.
 */

import { OptionalRecord, Uuid } from '@shared/types/utility.types'
import { v4 as uuidv4, validate } from 'uuid'
import { EssenceFilter, ShopEssence } from '@web/categories/essence/essence.types'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { BulkyShopOffer } from '@shared/types/bulky.types'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { ScarabFilter, ShopScarab } from '@web/categories/scarab/scarab.types'
import { DeliriumOrbFilter, ShopDeliriumOrb } from '@web/categories/deliriumOrb/deliriumOrb.types'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'

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

/** Validate if a given string is a essence offer uuid. */
function isEssenceOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopEssence>> {
	const store = useEssenceOfferStore()
	return !!store.offers.has(uuid)
}

/** Validate if a given string is a essence filter uuid */
function isEssenceFilterUuid(uuid: string): uuid is Uuid<EssenceFilter> {
	const store = useEssenceFilterStore()
	return !!store.filters.has(uuid)
}

/** Validate if a given string is a scarab offer uuid. */
function isScarabOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopScarab>> {
	const store = useScarabOfferStore()
	return !!store.offers.has(uuid)
}

/** Validate if a given string is a scarab filter uuid */
function isScarabFilterUuid(uuid: string): uuid is Uuid<ScarabFilter> {
	const store = useScarabFilterStore()
	return !!store.filters.has(uuid)
}

/** Validate if a given string is a delirium orb offer uuid. */
function isDeliriumOrbOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopDeliriumOrb>> {
	const store = useDeliriumOrbOfferStore()
	return !!store.offers.has(uuid)
}

/** Validate if a given string is a scarab filter uuid */
function isDeliriumOrbFilterUuid(uuid: string): uuid is Uuid<DeliriumOrbFilter> {
	const store = useDeliriumOrbFilterStore()
	return !!store.filters.has(uuid)
}

export const BULKY_UUID = {
	generateTypedUuid,
	isEssenceOfferUuid,
	isEssenceFilterUuid,
	isScarabOfferUuid,
	isScarabFilterUuid,
	isDeliriumOrbOfferUuid,
	isDeliriumOrbFilterUuid,
}
