import { getKeys, typedFromEntries } from '@shared/types/utility.types'

// DO NOT CHANGE THE ORDER
export const ESSENCE_TYPE = {
	ANGER: 'ANGER',
	ANGUISH: 'ANGUISH',
	CONTEMPT: 'CONTEMPT',
	DELIRIUM: 'DELIRIUM',
	DOUBT: 'DOUBT',
	DREAD: 'DREAD',
	ENVY: 'ENVY',
	FEAR: 'FEAR',
	GREED: 'GREED',
	HATRED: 'HATRED',
	HORROR: 'HORROR',
	HYSTERIA: 'HYSTERIA',
	INSANITY: 'INSANITY',
	LOATHING: 'LOATHING',
	MISERY: 'MISERY',
	RAGE: 'RAGE',
	SCORN: 'SCORN',
	SORROW: 'SORROW',
	SPITE: 'SPITE',
	SUFFERING: 'SUFFERING',
	TORMENT: 'TORMENT',
	WOE: 'WOE',
	WRATH: 'WRATH',
	ZEAL: 'ZEAL',
} as const

export const ESSENCE_TYPE_IDX_TO_NAME = getKeys(ESSENCE_TYPE)

export const ESSENCE_TYPE_NAME_TO_IDX = typedFromEntries(
	Object.entries(ESSENCE_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export const ESSENCE_TIER = {
	WHISPERING: 'WHISPERING',
	MUTTERING: 'MUTTERING',
	WEEPING: 'WEEPING',
	WAILING: 'WAILING',
	SCREAMING: 'SCREAMING',
	SHRIEKING: 'SHRIEKING',
	DEAFENING: 'DEAFENING',
	TIER_8: 'TIER_8',
} as const

export const ESSENCE_TIER_IDX_TO_NAME = getKeys(ESSENCE_TIER)

export const ESSENCE_TIER_NAME_TO_IDX = typedFromEntries(
	Object.entries(ESSENCE_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)
