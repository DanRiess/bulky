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
	BazaarMap8Mod,
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
import { BazaarBeast, BestiaryFilter, BestiaryFilterField, ShopBeast } from '@web/categories/bestiary/bestiary.types'
import { useBestiaryOfferStore } from '@web/categories/bestiary/bestiaryOffers.store'
import { useBestiaryFilterStore } from '@web/categories/bestiary/bestiaryFilter.store'
import { BazaarDelveItem, DelveFilter, DelveFilterField, ShopDelveItem } from '@web/categories/delve/delve.types'
import { useDelveOfferStore } from '@web/categories/delve/delveOffers.store'
import { useDelveFilterStore } from '@web/categories/delve/delveFilter.store'
import { BazaarCatalyst, CatalystFilter, CatalystFilterField, ShopCatalyst } from '@web/categories/catalyst/catalyst.types'
import { BazaarCurrency, CurrencyFilter, CurrencyFilterField, ShopCurrency } from '@web/categories/currency/currency.types'
import { useCatalystOfferStore } from '@web/categories/catalyst/catalystOffers.store'
import { useCatalystFilterStore } from '@web/categories/catalyst/catalystFilter.store'
import { useCurrencyOfferStore } from '@web/categories/currency/currencyOffers.store'
import { useCurrencyFilterStore } from '@web/categories/currency/currencyFilter.store'
import { BazaarHeistItem, HeistFilter, HeistFilterField, ShopHeistItem } from '@web/categories/heist/heist.types'
import { useHeistOfferStore } from '@web/categories/heist/heistOffers.store'
import { useHeistFilterStore } from '@web/categories/heist/heistFilter.store'
import {
	BazaarExpeditionItem,
	ExpeditionFilter,
	ExpeditionFilterField,
	ShopExpeditionItem,
} from '@web/categories/expedition/expedition.types'
import { useExpeditionOfferStore } from '@web/categories/expedition/expeditionOffers.store'
import { useExpeditionFilterStore } from '@web/categories/expedition/expeditionFilter.store'
import { BazaarFragment, FragmentFilter, FragmentFilterField, ShopFragment } from '@web/categories/fragment/fragment.types'
import { useFragmentOfferStore } from '@web/categories/fragment/fragmentOffers.store'
import { useFragmentFilterStore } from '@web/categories/fragment/fragmentFilter.store'

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
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarMap8Mod>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a map 8 mod filter uuid */
function isMap8ModFilterUuid(uuid: string): uuid is Uuid<Map8ModFilter> {
	const store = useMap8ModFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<Map8ModFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a bestiary offer uuid. */
function isBestiaryOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopBeast>> {
	const store = useBestiaryOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarBeast>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a bestiary filter uuid */
function isBestiaryFilterUuid(uuid: string): uuid is Uuid<BestiaryFilter> {
	const store = useBestiaryFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<BestiaryFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a delve offer uuid. */
function isDelveOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopDelveItem>> {
	const store = useDelveOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarDelveItem>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a delve filter uuid */
function isDelveFilterUuid(uuid: string): uuid is Uuid<DelveFilter> {
	const store = useDelveFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<DelveFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a catalyst offer uuid. */
function isCatalystOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopCatalyst>> {
	const store = useCatalystOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarCatalyst>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a catalyst filter uuid */
function isCatalystFilterUuid(uuid: string): uuid is Uuid<CatalystFilter> {
	const store = useCatalystFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<CatalystFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a currency offer uuid. */
function isCurrencyOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopCurrency>> {
	const store = useCurrencyOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarCurrency>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a currency filter uuid */
function isCurrencyFilterUuid(uuid: string): uuid is Uuid<CurrencyFilter> {
	const store = useCurrencyFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<CurrencyFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a heist offer uuid. */
function isHeistOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopHeistItem>> {
	const store = useHeistOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarHeistItem>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a heist filter uuid */
function isHeistFilterUuid(uuid: string): uuid is Uuid<HeistFilter> {
	const store = useHeistFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<HeistFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a expedition offer uuid. */
function isExpeditionOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopExpeditionItem>> {
	const store = useExpeditionOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarExpeditionItem>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a expedition filter uuid */
function isExpeditionFilterUuid(uuid: string): uuid is Uuid<ExpeditionFilter> {
	const store = useExpeditionFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<ExpeditionFilterField>>(uuid)
	return !!store.filters.has(typedUuid)
}

/** Validate if a given string is a fragment offer uuid. */
function isFragmentOfferUuid(uuid: string): uuid is Uuid<BulkyShopOffer<ShopFragment>> {
	const store = useFragmentOfferStore()
	const typedUuid = generateTypedUuid<BulkyBazaarOffer<BazaarFragment>>(uuid)
	return !!store.offers.has(typedUuid)
}

/** Validate if a given string is a fragment filter uuid */
function isFragmentFilterUuid(uuid: string): uuid is Uuid<FragmentFilter> {
	const store = useFragmentFilterStore()
	const typedUuid = generateTypedUuid<BulkyFilter<FragmentFilterField>>(uuid)
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
	isBestiaryOfferUuid,
	isBestiaryFilterUuid,
	isDelveOfferUuid,
	isDelveFilterUuid,
	isCatalystOfferUuid,
	isCatalystFilterUuid,
	isCurrencyOfferUuid,
	isCurrencyFilterUuid,
	isHeistOfferUuid,
	isHeistFilterUuid,
	isExpeditionOfferUuid,
	isExpeditionFilterUuid,
	isFragmentOfferUuid,
	isFragmentFilterUuid,
}
