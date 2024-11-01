import { DeepRequired, getKeys, ObjectValues } from '@shared/types/utility.types'
import {
	BulkyBazaarItemBase,
	BulkyBazaarOffer,
	BulkyFilter,
	BulkyFilterFieldBase,
	BulkyShopItemBase,
	CATEGORY,
	PerItemAttributes,
} from '@shared/types/bulky.types'
import { EXPEDITION_FACTION, EXPEDITION_TIER, EXPEDITION_TYPE } from './expedition.const'
import { useExpeditionOfferStore } from './expeditionOffers.store'
import { useExpeditionFilterStore } from './expeditionFilter.store'

// STORE TYPES
export type ExpeditionOfferStore = ReturnType<typeof useExpeditionOfferStore>
export type ExpeditionFilterStore = ReturnType<typeof useExpeditionFilterStore>

// ITEM TYPES

/** All possible expedition base types. */
export type ExpeditionType = ObjectValues<typeof EXPEDITION_TYPE>

/** All possible expedition tiers. */
export type ExpeditionTier = ObjectValues<typeof EXPEDITION_TIER>

/** All possible expedition factions. */
export type ExpeditionFaction = ObjectValues<typeof EXPEDITION_FACTION>

/** BulkyShopItem implementation for the 8 mod expedition category */
export type ShopExpeditionItem = Omit<BulkyShopItemBase<typeof CATEGORY.EXPEDITION>, 'perItemAttributes'> & {
	type: ExpeditionType
	tier: ExpeditionTier
	perItemAttributes?: LogbookPerItemAttributes[]
}

/** BulkyBazaarItem implementation for the 8 mod expedition category */
export type BazaarExpeditionItem = BulkyBazaarItemBase<typeof CATEGORY.EXPEDITION> & {
	type: ExpeditionType
	tier: ExpeditionTier
}

/** BulkyBazaarOffer implementation for the expedition category */
export type BazaarExpeditionOffer = BulkyBazaarOffer<BazaarExpeditionItem>

// FILTER TYPES

/** FilterField implementation for the expedition category */
export type ExpeditionFilterField = BulkyFilterFieldBase<typeof CATEGORY.EXPEDITION> & {
	type: ObjectValues<Omit<typeof EXPEDITION_TYPE, 'LOGBOOK'>>
	tier: ExpeditionTier
}

/** Filter implementation for the expedition category */
export type ExpeditionFilter = BulkyFilter<ExpeditionFilterField>

// UTILITY TYPES

/**
 * Logbook per item attributes require only the logbookMods property to be available on the item.
 * The original logbookMods property gets converted to a number[], where each number
 * represents the index of the faction as defined in EXPEDITION_FACTIONS. For example
 *
 * ```
 * logbookMods: [0, 2]
 * ```
 * means that the logbook has druids of the broken circle and black scythe mercenaries.
 */
export type LogbookPerItemAttributes = DeepRequired<PerItemAttributes, ['logbookMods']>

export function isLogbook(obj: any): obj is ShopExpeditionItem {
	return (
		obj &&
		'type' in obj &&
		getKeys(EXPEDITION_TYPE).includes(obj.type) &&
		'tier' in obj &&
		getKeys(EXPEDITION_TIER).includes(obj.tier) &&
		'perItemAttributes' in obj
	)
}
