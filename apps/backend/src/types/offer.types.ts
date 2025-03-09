import { ObjectValues, Uuid } from './utility'

type PerItemAttributesDto = {
	mods?: number[]
	props?: {
		iQnt?: number
		iRar?: number
		pckSz?: number
	}
	logbookMods?: number[]
}

export type BulkyItemDto = {
	type: number
	tier: number
	qnt: number
	prc: number
	pia?: PerItemAttributesDto[]
	rgx?: {
		avd?: number // only the added price, undefined if not available
		wnt?: number
		qnt?: [number, number][] // [[quantity, addedPrice], ...] or undefined if not available
		pckSz?: [number, number][]
	}
}

export type OfferDto = {
	uuid: Uuid
	version: number
	timestamp: number
	account: string
	ign: string
	category: Category
	league: string
	chaosPerDiv: number
	multiplier?: number
	fullPrice?: number
	minimumBuyout: number
	fullBuyout?: boolean
	items: BulkyItemDto[]
}

export const CATEGORY = {
	ESSENCE: 'ESSENCE',
	SCARAB: 'SCARAB',
	DELIRIUM_ORB: 'DELIRIUM_ORB',
	MAP: 'MAP',
	MAP_8_MOD: 'MAP_8_MOD',
	BESTIARY: 'BESTIARY',
	DELVE: 'DELVE',
	CATALYST: 'CATALYST',
	CURRENCY: 'CURRENCY',
	HEIST: 'HEIST',
	EXPEDITION: 'EXPEDITION',
	FRAGMENT: 'FRAGMENT',
} as const

export type Category = ObjectValues<typeof CATEGORY>

export type BulkyOfferGetQueryParams = {
	category: Category
	league: string
	timestamp: string // Has to be parsed into a number later
}

export type DynamoDBBulkyOffer = OfferDto & {
	categoryLeague: `${OfferDto['category']}_${OfferDto['league']}`
	timestampUuid: `${OfferDto['timestamp']}_${OfferDto['uuid']}`
	ttlTimestamp: number
}

export type BulkyOfferDeleteQueryParams = {
	category: Category
	league: string
	uuid: Uuid
	timestamps: string // Has to be parsed into a number[] later
}
