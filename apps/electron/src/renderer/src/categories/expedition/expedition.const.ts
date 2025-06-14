import { typedFromEntries, getKeys } from '@shared/types/utility.types'
import { ExpeditionFaction } from './expedition.types'
import { BulkyShopItem } from '@shared/types/bulky.types'

export const EXPEDITION_TYPE = {
	ASTRAGALI: 'ASTRAGALI',
	EXOTIC_COINAGE: 'EXOTIC_COINAGE',
	SCRAP_METAL: 'SCRAP_METAL',
	BURIAL_MEDALLION: 'BURIAL_MEDALLION',
	LOGBOOK_DRUIDS_OF_THE_BROKEN_CIRCLE: 'LOGBOOK_DRUIDS_OF_THE_BROKEN_CIRCLE',
	LOGBOOK_ORDER_OF_THE_CHALICE: 'LOGBOOK_ORDER_OF_THE_CHALICE',
	LOGBOOK_BLACK_SCYTHE_MERCENARIES: 'LOGBOOK_BLACK_SCYTHE_MERCENARIES',
	LOGBOOK_KNIGHTS_OF_THE_SUN: 'LOGBOOK_KNIGHTS_OF_THE_SUN',
	LOGBOOK: 'LOGBOOK',
} as const

export const EXPEDITION_TYPE_IDX_TO_NAME = getKeys(EXPEDITION_TYPE)

export const EXPEDITION_TYPE_NAME_TO_IDX = typedFromEntries(
	Object.entries(EXPEDITION_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export const EXPEDITION_TIER = {
	'0': '0',
	'ILVL_68-72': 'ILVL_68-72',
	'ILVL_73-77': 'ILVL_73-77',
	'ILVL_78-82': 'ILVL_78-82',
	'ILVL_83+': 'ILVL_83+',
} as const

export const EXPEDITION_TIER_IDX_TO_NAME = getKeys(EXPEDITION_TIER)

export const EXPEDITION_TIER_NAME_TO_IDX = typedFromEntries(
	Object.entries(EXPEDITION_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export const EXPEDITION_FACTION = {
	DRUIDS_OF_THE_BROKEN_CIRCLE: 'DRUIDS_OF_THE_BROKEN_CIRCLE',
	ORDER_OF_THE_CHALICE: 'ORDER_OF_THE_CHALICE',
	BLACK_SCYTHE_MERCENARIES: 'BLACK_SCYTHE_MERCENARIES',
	KNIGHTS_OF_THE_SUN: 'KNIGHTS_OF_THE_SUN',
} as const

export const EXPEDITION_FACTION_IDX_TO_NAME = getKeys(EXPEDITION_FACTION)

export const EXPEDITION_FACTION_NAME_TO_IDX = typedFromEntries(
	Object.entries(EXPEDITION_FACTION_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export function getFactionFromType(type: BulkyShopItem['type']): ExpeditionFaction | undefined {
	if (type === 'LOGBOOK_BLACK_SCYTHE_MERCENARIES') return 'BLACK_SCYTHE_MERCENARIES'
	else if (type === 'LOGBOOK_DRUIDS_OF_THE_BROKEN_CIRCLE') return 'DRUIDS_OF_THE_BROKEN_CIRCLE'
	else if (type === 'LOGBOOK_KNIGHTS_OF_THE_SUN') return 'KNIGHTS_OF_THE_SUN'
	else if (type === 'LOGBOOK_ORDER_OF_THE_CHALICE') return 'ORDER_OF_THE_CHALICE'
	return undefined
}
