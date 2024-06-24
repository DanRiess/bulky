import { typedFromEntries } from '@shared/types/utility.types'

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

export const ESSENCE_TYPE_IDX_TO_NAME = {
	0: 'GREED',
	1: 'CONTEMPT',
	2: 'HATRED',
	3: 'WOE',
	4: 'FEAR',
	5: 'ANGER',
	6: 'TORMENT',
	7: 'SORROW',
	8: 'RAGE',
	9: 'SUFFERING',
	10: 'WRATH',
	11: 'DOUBT',
	12: 'LOATHING',
	13: 'ZEAL',
	14: 'ANGUISH',
	15: 'SPITE',
	16: 'SCORN',
	17: 'ENVY',
	18: 'MISERY',
	19: 'DREAD',
	20: 'INSANITY',
	21: 'HORROR',
	22: 'DELIRIUM',
	23: 'HYSTERIA',
} as const

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

export const ESSENCE_TIER_IDX_TO_NAME = {
	1: 'WHISPERING',
	2: 'MUTTERING',
	3: 'WEEPING',
	4: 'WAILING',
	5: 'SCREAMING',
	6: 'SHRIEKING',
	7: 'DEAFENING',
	8: 'TIER_8',
} as const

export const ESSENCE_TIER_NAME_TO_IDX = typedFromEntries(
	Object.entries(ESSENCE_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)
