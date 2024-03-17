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
	n: string
	i: number
	id: string
	type: string
	selected: boolean
	colour: {
		r: number
		g: number
		b: number
	}
	srcL: string
	srcC: string
	srcR: string
}

export type StashTabListDto = {
	numTabs: number
	tabs: StashTabListItemDto[]
}
