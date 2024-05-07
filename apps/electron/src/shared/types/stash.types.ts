import { Id, ObjectValues } from './utility.types'

// PoeStashType
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

// BulkyStashTab
export type PoeStashTab = {
	name: string
	index: number
	id: Id<PoeStashTab>
	parentId?: Id<PoeStashTab>
	children?: Id<PoeStashTab>[]
	color?: string
	lastSnapshot: number
	// icon: string // check if the actual api has that or not
	type: StashType
	league: string
	// items: PoeItemDto[]
	selected: boolean // for v-model
}
