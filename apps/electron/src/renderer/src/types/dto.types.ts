export type GenericListingItemDto = {
	name: string
	quantity: number
	price: number
	uses?: number
	tier?: number
}

export type GenericListingDto = {
	category: string
	uuid: string
	ign: string
	league: string
	chaosPerDiv: number
	multiplier: number
	minimumBuyout?: number
	items: GenericListingItemDto[]
}
