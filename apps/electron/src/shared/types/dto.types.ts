import { PoeItem } from './poe.types'

export type GenericListingItemDto = {
	name: string
	quantity: number
	price: number
	tier?: number
}

// export type GenericListingDto = {
// 	category: string
// 	uuid: string
// 	ign: string
// 	league: string
// 	chaosPerDiv: number
// 	multiplier: number
// 	minimumBuyout?: number
// 	items: GenericListingItemDto[]
// }

export type GenericListingDto = {
	category: string
	uuid: string
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	minimumBuyout?: number
	items: string
}

export type StashTabListItemDto = {
	id: string
	parent?: string
	name: string
	type: string
	index?: number
	metadata: {
		public?: true
		folder?: true
		colour?: string
	}
	children?: StashTabListItemDto[]
}

export type StashTabDto = StashTabListItemDto & {
	items: PoeItem[]
}

export type StashTabListDto = {
	numTabs: number
	tabs: StashTabListItemDto[]
}
