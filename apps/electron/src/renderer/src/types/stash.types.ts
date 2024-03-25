import { PoeItem } from './poe.types'
import { ObjectValues } from './utility.types'

export const STASH_TYPE = {
	Stash: 'Stash',
	PremiumStash: 'PremiumStash',
	QuadStash: 'QuadStash',
	CurrencyStash: 'CurrencyStash',
	MapStash: 'MapStash',
	FragmentStash: 'FragmentStash',
	DivinationCardStash: 'DivinationCardStash',
	EssenceStash: 'EssenceStash',
	DeliriumStash: 'DeliriumStash',
	DelveStash: 'DelveStash',
	BlightStash: 'BlightStash',
	UltimatumStash: 'UltimatumStash',
} as const

export type StashType = ObjectValues<typeof STASH_TYPE>

export type StashTab = {
	lastSnapshot: number
	name: string
	id: string
	selected: boolean
	// icon: string // check if the actual api has that or not
	type: StashType
	items: PoeItem[]
}
