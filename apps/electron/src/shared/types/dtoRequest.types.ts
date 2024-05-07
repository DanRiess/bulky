// TODO: rework these, test typing them here already
// listing is salesRecord, salesRecordItemDetails foor items
export type GenericListingItemDto = {
	name: string
	quantity: number
	price: number
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
	items: string
}
