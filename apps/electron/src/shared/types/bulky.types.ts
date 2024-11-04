import {
	ShopEssence,
	BazaarEssence,
	EssenceFilterField,
	EssenceFilterStore,
	EssenceOfferStore,
} from 'src/renderer/src/categories/essence/essence.types'
import { MaybeComputedRef, ObjectValues, Uuid, getKeys } from './utility.types'
import { ComputedRef, UnwrapRef } from 'vue'
import {
	BazaarScarab,
	ScarabFilterField,
	ScarabFilterStore,
	ScarabOfferStore,
	ShopScarab,
} from 'src/renderer/src/categories/scarab/scarab.types'
import { PoeStashTab } from './poe.types'
import {
	BazaarDeliriumOrb,
	DeliriumOrbFilterField,
	DeliriumOrbFilterStore,
	DeliriumOrbOfferStore,
	ShopDeliriumOrb,
} from 'src/renderer/src/categories/deliriumOrb/deliriumOrb.types'
import {
	BazaarMap,
	BazaarMap8Mod,
	Map8ModFilterField,
	Map8ModFilterStore,
	Map8ModOfferStore,
	Map8ModPrices,
	MapFilterField,
	NormalMapFilterStore,
	NormalMapOfferStore,
	ShopMap,
	ShopMap8Mod,
} from 'src/renderer/src/categories/map/map.types'
import {
	BazaarBeast,
	BestiaryFilterField,
	BestiaryFilterStore,
	BestiaryOfferStore,
	ShopBeast,
} from '@web/categories/beastiary/bestiary.types'
import {
	BazaarDelveItem,
	DelveFilterField,
	DelveFilterStore,
	DelveOfferStore,
	ShopDelveItem,
} from '@web/categories/delve/delve.types'
import {
	BazaarCatalyst,
	CatalystFilterField,
	CatalystFilterStore,
	CatalystOfferStore,
	ShopCatalyst,
} from '@web/categories/catalyst/catalyst.types'
import {
	BazaarCurrency,
	CurrencyFilterField,
	CurrencyFilterStore,
	CurrencyOfferStore,
	ShopCurrency,
} from '@web/categories/currency/currency.types'
import {
	BazaarHeistItem,
	HeistFilterField,
	HeistFilterStore,
	HeistOfferStore,
	ShopHeistItem,
} from '@web/categories/heist/heist.types'
import {
	BazaarExpeditionItem,
	ExpeditionFilterField,
	ExpeditionFilterStore,
	ExpeditionOfferStore,
	ShopExpeditionItem,
} from '@web/categories/expedition/expedition.types'
import {
	BazaarFragment,
	FragmentFilterField,
	FragmentFilterStore,
	FragmentOfferStore,
	ShopFragment,
} from '@web/categories/fragment/fragment.types'

// APP STATE TYPES

// DO NOT CHANGE THE ORDER
export const CATEGORY = {
	ESSENCE: 'ESSENCE',
	SCARAB: 'SCARAB',
	DELIRIUM_ORB: 'DELIRIUM_ORB',
	MAP: 'MAP',
	MAP_8_MOD: 'MAP_8_MOD',
	BESTIARY: 'BESTIARY',
	DELVE: 'DELVE',
	CATALYST: 'CATALYST',
	CURRENCY: 'CURRENCY',
	HEIST: 'HEIST',
	EXPEDITION: 'EXPEDITION',
	FRAGMENT: 'FRAGMENT',
} as const

export const CATEGORY_IDX_TO_NAME = getKeys(CATEGORY)
export const CATEGORY_NAME_TO_IDX = CATEGORY_IDX_TO_NAME.reduce((prev, curr, idx) => {
	prev[curr] = idx
	return prev
}, {} as Record<keyof typeof CATEGORY, number>)

export type Category = ObjectValues<typeof CATEGORY>

export type BulkyItemOptions = {
	prefix: string[]
	suffix: string[]
}

// STORES
export type BulkyOfferStore =
	| EssenceOfferStore
	| ScarabOfferStore
	| DeliriumOrbOfferStore
	| NormalMapOfferStore
	| Map8ModOfferStore
	| BestiaryOfferStore
	| DelveOfferStore
	| CatalystOfferStore
	| CurrencyOfferStore
	| HeistOfferStore
	| ExpeditionOfferStore
	| FragmentOfferStore

export type BulkyFilterStore =
	| EssenceFilterStore
	| ScarabFilterStore
	| DeliriumOrbFilterStore
	| NormalMapFilterStore
	| Map8ModFilterStore
	| BestiaryFilterStore
	| DelveFilterStore
	| CatalystFilterStore
	| CurrencyFilterStore
	| HeistFilterStore
	| ExpeditionFilterStore
	| FragmentFilterStore

// BULKY SHOP ITEM TYPES

export type PerItemAttributes = {
	itemId: string
	modifiers?: number[]
	properties?: {
		itemQuantity?: number
		itemRarity?: number
		packSize?: number
	}
	logbookMods?: number[]
}

/**
 * Generic type that needs to be extended to make sense. This is done in the categories' type files.
 *
 * @example
 * type ShopEssence = BulkyShopItemBase<typeof CATEGORY.ESSENCE> & {
 *		type: EssenceType
 *		tier: EssenceTier
 *	}
 */
export type BulkyShopItemBase<T extends Category> = {
	category: T
	name: string
	type: string // will be overridden
	quantity: number
	price: MaybeComputedRef<number>
	priceOverride: ComputedRef<number>
	priceOverrideMap8Mod?: ComputedRef<Map8ModPrices>
	icon: string
	league: string
	selected: MaybeComputedRef<boolean>
	allowRegexFilter?: MaybeComputedRef<boolean>
	perItemAttributes?: PerItemAttributes[]
}

/**
 * A collection of every implementation of BulkyShopItemBase throughout the app.
 * This will be used as a generic type argument for every higher level type.
 */
export type BulkyShopItem =
	| ShopEssence
	| ShopScarab
	| ShopDeliriumOrb
	| ShopMap
	| ShopMap8Mod
	| ShopBeast
	| ShopDelveItem
	| ShopCatalyst
	| ShopCurrency
	| ShopHeistItem
	| ShopExpeditionItem
	| ShopFragment

/** Type that bulky items will be saved as */
export type BulkyShopItemRecord<T extends BulkyShopItem = BulkyShopItem> = Map<`${T['type']}_${T['tier']}`, T>

/**
 * A BulkyShopOffer contains all necessary offer metadata as well as the items contained within the offer.
 * This type can be used as a generic type argument or to instantiate a type-safe offer.
 *
 * @example
 * const essenceOffer: BulkyShopOffer<ShopEssence> = {
 * 		metadata: metadata
 * 		items: ShopEssence[] // will throw if any item other than an essence is pushed
 * }
 */
export type BulkyShopOffer<T extends BulkyShopItem = BulkyShopItem> = {
	uuid: Uuid<BulkyShopOffer<T>>
	user: string
	ign: string
	league: string
	category: T['category']
	stashTabIds: PoeStashTab['id'][]
	chaosPerDiv: number
	multiplier?: number
	computedMultiplier?: number
	/**
	 * Do not change this type to a number.
	 * While more consistent, when the offer updates, chaosPerDiv updates as well.
	 * However, the user would expect that his minimum buyout stays the same.
	 * 2 div should stay that regardless of whether the ratio is 1:100 or 1:150.
	 */
	minimumBuyout: TotalPrice
	fullBuyout?: boolean
	items: UnwrapRef<T>[]
	filter?: ShopFilter<T>
	fullPrice: number
	lastUploaded: number
	active: boolean
	autoSync: boolean
}

// BULKY BAZAAR ITEM TYPES

export type BulkyBazaarItemBase<T extends Category> = {
	category: T
	name: string
	type: string // will be overridden
	tier: string
	options?: BulkyItemOptions
	quantity: number
	computedQuantity: number
	price: number
	regex?: {
		avoidRegex?: number // only the added price, undefined if not available
		wantedRegex?: number
		quantityRegex?: [number, number][] // [[quantity, addedPrice], ...] or undefined if not available
		packsizeRegex?: [number, number][]
	}
	/** The actual url, not the /data/static id. */
	icon: string
	perItemAttributes?: PerItemAttributes[]
}

export type BulkyBazaarItem =
	| BazaarEssence
	| BazaarScarab
	| BazaarDeliriumOrb
	| BazaarMap
	| BazaarMap8Mod
	| BazaarBeast
	| BazaarDelveItem
	| BazaarCatalyst
	| BazaarCurrency
	| BazaarHeistItem
	| BazaarExpeditionItem
	| BazaarFragment

export type BulkyBazaarItemRecord<T extends BulkyBazaarItem = BulkyBazaarItem> = Map<`${T['type']}_${T['tier']}`, T>

export type BulkyBazaarOffer<T extends BulkyBazaarItem = BulkyBazaarItem> = {
	uuid: Uuid<BulkyBazaarOffer<T>>
	category: T['category']
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	fullPrice: number
	minimumBuyout: number
	items: T[]
	contact: {
		messageSent: boolean
		timestamp: number
	}
}

/**
 * This type will be generated on demand to be passed down to components.
 * Depending on the category (and at a later stage depending on the filter name as well),
 * it will choose a filter from the correct store and computed utility functions around it.
 */
export type ComputedBulkyOfferStore = {
	offers: Map<BulkyBazaarOffer['uuid'], BulkyBazaarOffer>
	calculateBaseItemPrice: (item: BulkyBazaarItem, filter: BulkyFilter) => number
}

// FILTER TYPES

/**
 * Generic type that needs to be extended to make sense. This is done in the categories' type files.
 *
 * @example
 * type EssenceFilterField = BulkyFilterFieldBase<typeof CATEGORY.ESSENCE> & {
 *		type: EssenceType
 *		tier: EssenceTier
 *	}
 */
export type BulkyFilterFieldBase<T extends Category> = {
	uuid: Uuid<BulkyFilterFieldBase<T>>
	category: T
	type: string
	quantity: number
	options?: Record<string, unknown>
}

/**
 * A collection of every implementation of BulkyFilterFieldBase throughout the app.
 */
export type BulkyFilterField =
	| EssenceFilterField
	| ScarabFilterField
	| DeliriumOrbFilterField
	| MapFilterField
	| Map8ModFilterField
	| BestiaryFilterField
	| DelveFilterField
	| CatalystFilterField
	| CurrencyFilterField
	| HeistFilterField
	| ExpeditionFilterField
	| FragmentFilterField

/**
 * A BulkyFilter contains all necessary filter metadata as well as the fields contained within the filter.
 * This type can be used as a generic type argument or to instantiate a type-safe filter.
 *
 * @example
 * const essenceFilter: BulkyFilter<EssenceFilterField> = {
 * 		...metadata: metadata
 * 		fields: EssenceFilterField[] // will throw if incorrect filter field is pushed
 * }
 */
export type BulkyFilter<T extends BulkyFilterField = BulkyFilterField> = {
	uuid: Uuid<BulkyFilter<T>>
	category: T['category']
	name: string
	multiplier?: number
	fullBuyout?: boolean
	regex?: string
	fullSets?: boolean
	alwaysMaxQuantity: boolean
	fields: T[]
	individualFields?: T[]
	setFields?: T[]
}

/**
 * This type will be generated on demand to be passed down to components.
 * Depending on the category (and at a later stage depending on the filter name as well),
 * it will choose a filter from the correct store and computed utility functions around it.
 */
export type ComputedBulkyFilterStore = {
	filter: BulkyFilter
	filterFieldTypeOptions: Exclude<BulkyFilterField['type'], 'LOGBOOK'>[]
	filterFieldTierOptions: BulkyFilterField['tier'][]
	addFilterField: <T extends BulkyFilter['uuid']>(uuid: T) => void
	removeFilterField: <T extends BulkyFilter['uuid']>(uuid: T, idx: number) => void
}

// SHOP FILTER

/**
 * A filter that can be used when creating / editing an offer for some categories (e. g. maps).
 */
export type ShopFilter<T extends BulkyShopItem = BulkyShopItem> = {
	selectedTiers?: Set<T['tier']>
}

// PRICES

/**
 * Price overrides are being saved separately. This is why this type needs to have all of
 * the additional metadata.
 */
export type BulkyItemOverrideInstance<T extends BulkyShopItem = BulkyShopItem> = {
	category: T['category']
	type: T['type']
	tier: T['tier']
	league: string
	priceOverride: number
	priceOverrideMap8Mod?: Map8ModPrices
	selected: boolean
	allowRegexFilter?: boolean
}

/**
 * Structures overrides in map form.
 * The key is the item type and item tier, the value is the item.
 *
 * @example
 * const essenceOverrideRecord = new Map({
 * 	'ZEAL_DEAFENING': EssenceItem
 * })
 */
export type BulkyItemOverrideRecord<T extends BulkyShopItem = BulkyShopItem> = Map<
	`${T['type']}_${T['tier']}`,
	BulkyItemOverrideInstance<T>
>

/**
 * Properties in a BulkyShopItem that can be overwritten and saved to the DB.
 * This type serves as a function argument mostly.
 */
export type BulkyItemOverrideOptions = {
	price?: number
	priceMap8Mod?: Map8ModPrices
	selected?: boolean
	allowRegexFilter?: boolean
}

export type TotalPrice = { chaos: number; divine: number }

// DTO TYPES

type PerItemAttributesDto = {
	mods?: number[]
	props?: {
		iQnt?: number
		iRar?: number
		pckSz?: number
	}
	logbookMods?: number[]
}

export type BulkyBazaarItemDto = {
	type: number
	tier: number
	qnt: number
	prc: number
	pia?: PerItemAttributesDto[]
	rgx?: {
		avd?: number // only the added price, undefined if not available
		wnt?: number
		qnt?: [number, number][] // [[quantity, addedPrice], ...] or undefined if not available
		pckSz?: [number, number][]
	}
}

export type BulkyBazaarOfferDto = {
	uuid: string
	version: number
	timestamp: number
	account: string
	ign: string
	category: string
	league: string
	chaosPerDiv: number
	multiplier?: number
	fullPrice?: number
	minimumBuyout: number
	fullBuyout?: boolean
	items: BulkyBazaarItemDto[]
}

// UTILITY TYPES

export type BulkyItemSortOptions = {
	key: 'NAME' | 'TIER' | 'QUANT' | 'PRICE' | 'STACKPRICE'
	direction: 'ASC' | 'DESC'
}

export type BulkyRegexes = {
	quantity: RegExp[]
	packSize: RegExp[]
	rarity: RegExp[]
	avoid: RegExp[]
	wanted: RegExp[]
}
