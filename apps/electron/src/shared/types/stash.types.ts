import { Id, ObjectValues } from './utility.types'

export const STASH_TYPE = {
	Folder: 'Folder',
	NormalStash: 'NormalStash',
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
	name: string
	index: number
	id: Id<StashTab>
	parentId?: Id<StashTab>
	children?: Id<StashTab>[]
	color?: string
	lastSnapshot: number
	// icon: string // check if the actual api has that or not
	type: StashType
	league: string
	// items: PoeItem[]
	selected: boolean // for v-model
}
