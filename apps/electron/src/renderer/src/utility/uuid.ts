/**
 * This component provides static functions to generate / validate branded uuids.
 */

import { OptionalRecord, Uuid } from '@shared/types/utility.types'
import { v4 as uuidv4, validate } from 'uuid'
import { BazaarEssence, EssenceFilter, EssenceFilterField, ShopEssence } from '@web/categories/essence/essence.types'
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import { useEssenceFilterStore } from '@web/categories/essence/essenceFilter.store'
import { BulkyBazaarOffer, BulkyFilter, BulkyShopOffer } from '@shared/types/bulky.types'
import { useScarabFilterStore } from '@web/categories/scarab/scarabFilter.store'
import { useScarabOfferStore } from '@web/categories/scarab/scarabOffers.store'
import { BazaarScarab, ScarabFilter, ScarabFilterField, ShopScarab } from '@web/categories/scarab/scarab.types'
import {
	BazaarDeliriumOrb,
	DeliriumOrbFilter,
	DeliriumOrbFilterField,
	ShopDeliriumOrb,
} from '@web/categories/deliriumOrb/deliriumOrb.types'
import { useDeliriumOrbOfferStore } from '@web/categories/deliriumOrb/deliriumOrbOffer.store'
import { useDeliriumOrbFilterStore } from '@web/categories/deliriumOrb/deliriumOrbFilter.store'
import { useNormalMapOfferStore } from '@web/categories/map/normalMapOffers.store'
import {
	BazaarMap,
	Map8ModFilter,
	Map8ModFilterField,
	MapFilter,
	MapFilterField,
	ShopMap,
	ShopMap8Mod,
} from '@web/categories/map/map.types'
import { useNormalMapFilterStore } from '@web/categories/map/normalMapFilter.store'
import { useMap8ModOfferStore } from '@web/categories/map/map8ModOffers.store'
import { useMap8ModFilterStore } from '@web/categories/map/map8ModFilter.store'

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
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarEssence>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a essence filter uuid */
function isEssenceFilterUuid(uuid: string): uuid is Uuid<EssenceFilter> {
	const store = useEssenceFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<EssenceFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a scarab offer uuid. */
function isScarabOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopScarab>> {
	const store = useScarabOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarScarab>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a scarab filter uuid */
function isScarabFilterUuid(uuid: string): uuid is Uuid<ScarabFilter> {
	const store = useScarabFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<ScarabFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a delirium orb offer uuid. */
function isDeliriumOrbOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopDeliriumOrb>> {
	const store = useDeliriumOrbOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarDeliriumOrb>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a delirium orb filter uuid */
function isDeliriumOrbFilterUuid(uuid: string): uuid is Uuid<DeliriumOrbFilter> {
	const store = useDeliriumOrbFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<DeliriumOrbFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a map offer uuid. */
function isMapOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopMap>> {
	const store = useNormalMapOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarMap>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a map filter uuid */
function isMapFilterUuid(uuid: string): uuid is Uuid<MapFilter> {
	const store = useNormalMapFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<MapFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a map 8 mod offer uuid. */
function isMap8ModOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopMap8Mod>> {
	const store = useMap8ModOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarMap>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a map 8 mod filter uuid */
function isMap8ModFilterUuid(uuid: string): uuid is Uuid<Map8ModFilter> {
	const store = useMap8ModFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<Map8ModFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

export const BULKY_UUID = {
	generateTypedUuid,
	isEssenceOfferUuid,
	isEssenceFilterUuid,
	isScarabOfferUuid,
	isScarabFilterUuid,
	isDeliriumOrbOfferUuid,
	isDeliriumOrbFilterUuid,
	isMapOfferUuid,
	isMapFilterUuid,
	isMap8ModOfferUuid,
	isMap8ModFilterUuid,
}
