import { Id } from './utility.types'

export type NinjaPriceRecord = Map<NinjaItem['name'], NinjaItem>

export type NinjaPriceCollection = {
	category: NinjaCategory
	league: string
	lastSnapshot: number
	items: NinjaItem[]
}

export type NinjaItem = {
	id: Id<NinjaItem>
	name: string
	mapTier: number | null
	chaos: number
	// tendency: number // receiveSparkLine.totalChange (number in percent)
}

export type NinjaCurrencyDto = {
	currencyTypeName: string
	chaosEquivalent: number
	detailsId: string
	pay: NinjaSparkLineDetails
	receive: NinjaSparkLineDetails
	paySparkLine: NinjaSparkLine
	receiveSparkLine: NinjaSparkLine
	lowConfidencePaySparkLine: NinjaSparkLine
	lowConfidenceReceiveSparkLine: NinjaSparkLine
}

export type NinjaItemDto = {
	id: number
	name: string
	icon: string
	baseType: string
	mapTier?: number
	stackSize: number
	itemClass: number
	sparkline: NinjaSparkLine
	lowConfidenceSparkLine: NinjaSparkLine
	implicitModifiers: string[]
	explicitModifiers: string[]
	flavourText: string
	chaosValue: number
	exaltedValue: number
	divineValue: number
	count: number
	detailsId: string
	tradeInfo: string[]
	listingCount: number
}

export type NinjaCategory =
	| 'Currency'
	| 'Fragment'
	| 'Oil'
	| 'Incubator'
	| 'Scarab'
	| 'Fossil'
	| 'Resonator'
	| 'Essence'
	| 'DivinationCard'
	| 'SkillGem'
	| 'BaseType'
	| 'UniqueMap'
	| 'Map'
	| 'UniqueJewel'
	| 'UniqueFlask'
	| 'UniqueWeapon'
	| 'UniqueArmour'
	| 'UniqueAccessory'
	| 'Beast'
	| 'DeliriumOrb'
	| 'Tatoo'
	| 'Omen'
	| 'UniqueRelic'
	| 'Vial'
	| 'Invitation'
	| 'Artifact'
	| 'Memory'
	| 'BlightedMap'
	| 'BlightRavagedMap'
	| 'Coffin'
	| 'AllflameEmber'
	| 'ClusterJewel'

type NinjaSparkLineDetails = {
	id: number
	league_id: number
	pay_currency_id: number
	get_currency_id: number
	sample_time_utc: string
	count: number
	value: number
	data_point_count: number
	includes_secondary: boolean
	listing_count: number
}

type NinjaSparkLine = {
	data: number[]
	totalChange: number
}

/**
 * Preprocessed Ninja Item. Array: [itemName, itemPrice, mapTier | null]
 */
export type PreprocessedNinjaItem = [string, number, number | null]

export type PreprocessedNinjaFile = {
	category: NinjaCategory
	items: PreprocessedNinjaItem[]
}[]
