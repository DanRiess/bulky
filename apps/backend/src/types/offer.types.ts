import { ObjectValues } from './utitlity.types'

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
	uuid: string
	version: number
	timestamp: number
	account: string
	ign: string
	category: string
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

export type DynamoDBBulkyOffer = {
	categoryLeague: { S: string } // Concatenation of category and league
	timestampUuid: { S: string } // Concatenation of timestamp and UUID
	uuid: { S: string } // Offer UUID
	version: { N: string } // Version number as a stringified number
	timestamp: { N: string } // Timestamp as a stringified number
	ttlTimestamp: { N: string } // TTL timestamp as a stringified number
	account: { S: string } // Account name
	ign: { S: string } // In-game name
	chaosPerDiv: { N: string } // Chaos per Divine ratio
	multiplier: { N: string } | { NULL: true } // Optional multiplier
	fullPrice: { N: string } | { NULL: true } // Optional full price
	minimumBuyout: { N: string } // Minimum buyout price
	fullBuyout: { BOOL: boolean } | { NULL: true } // Optional full buyout flag
	items: { L: { M: DynamoDBBulkyItem }[] } // List of bulky items
}

export type DynamoDBAttribute =
	| { S: string } // String
	| { N: string } // Number (stringified)
	| { BOOL: boolean } // Boolean
	| { NULL: boolean } // Null
	| { L: DynamoDBAttribute[] } // List
	| { M: Record<string, DynamoDBAttribute> } // Map

export interface DynamoDBBulkyItem {
	type: { N: string } // Stringified number
	tier: { N: string } // Stringified number
	quantity: { N: string } // Stringified number
	price: { N: string } // Stringified number
	perItemAttributes?:
		| {
				L: {
					M: {
						mods?: { L: { N: string }[] } | { NULL: boolean }
						props?:
							| {
									M: {
										iQnt?: { N: string } | { NULL: boolean }
										iRar?: { N: string } | { NULL: boolean }
										pckSz?: { N: string } | { NULL: boolean }
									}
							  }
							| { NULL: boolean }
						logbookMods?: { L: { N: string }[] } | { NULL: boolean }
					}
				}[]
		  }
		| { NULL: boolean }
	regex?:
		| {
				M: {
					avd?: { N: string } | { NULL: boolean }
					wnt?: { N: string } | { NULL: boolean }
					qnt?:
						| {
								L: {
									L: [{ N: string }, { N: string }]
								}[]
						  }
						| { NULL: boolean }
					pckSz?:
						| {
								L: {
									L: [{ N: string }, { N: string }]
								}[]
						  }
						| { NULL: boolean }
				}
		  }
		| { NULL: boolean }
}
