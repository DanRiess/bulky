import { typedFromEntries, getKeys } from '@shared/types/utility.types'

export const HEIST_TYPE = {
	BLUEPRINT: 'BLUEPRINT',
	BLUEPRINT_3_WINGS: 'BLUEPRINT_3_WINGS',
	BLUEPRINT_4_WINGS: 'BLUEPRINT_4_WINGS',
	AGILITY: 'AGILITY',
	BRUTE_FORCE: 'BRUTE_FORCE',
	'COUNTER-THAUMATURGY': 'COUNTER-THAUMATURGY',
	DECEPTION: 'DECEPTION',
	DEMOLITION: 'DEMOLITION',
	ENGINEERING: 'ENGINEERING',
	LOCKPICKING: 'LOCKPICKING',
	PERCEPTION: 'PERCEPTION',
	TRAP_DISARMAMENT: 'TRAP_DISARMAMENT',
} as const

export const HEIST_TYPE_IDX_TO_NAME = getKeys(HEIST_TYPE)

export const HEIST_TYPE_NAME_TO_IDX = typedFromEntries(
	Object.entries(HEIST_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export const HEIST_TIER = {
	'ILVL_68-72': 'ILVL_68-72',
	'ILVL_73-77': 'ILVL_73-77',
	'ILVL_78-82': 'ILVL_78-82',
	'ILVL_83+': 'ILVL_83+',
} as const

export const HEIST_TIER_IDX_TO_NAME = getKeys(HEIST_TIER)

export const HEIST_TIER_NAME_TO_IDX = typedFromEntries(
	Object.entries(HEIST_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)
