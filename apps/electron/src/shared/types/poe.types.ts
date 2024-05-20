import { PoeItemDto } from './dtoResponse.types'
import { Id, ObjectValues } from './utility.types'

// PoeStashType
export const POE_STASH_TYPE = {
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

export type PoeStashType = ObjectValues<typeof POE_STASH_TYPE>

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
	type: PoeStashType
	league: string
	// items: PoeItemDto[]
	selected: boolean // for v-model
}

export type PoeItem = Pick<
	PoeItemDto,
	| 'name'
	| 'baseType'
	| 'icon'
	| 'itemLevel'
	| 'stackSize'
	| 'maxStackSize'
	| 'implicitMods'
	| 'explicitMods'
	| 'ultimatumMods'
	| 'enchantMods'
	| 'w'
	| 'h'
	| 'x'
	| 'y'
> & {
	id: Id<PoeItem>
	stashTabId: Id<PoeStashTab>
}

export type PoeItemsByStash = {
	[key: PoeStashTab['id']]: PoeItem[]
}
