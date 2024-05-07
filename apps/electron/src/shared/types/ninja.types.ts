import { Id } from './utility.types'

// Prefix all new type names with 'Ninja'

// BulkyPriceCollection
export type CurrentNinjaPrices = Record<BulkyNinjaPriceItem['name'], BulkyNinjaPriceItem>

// CategoryPriceBlock
export type BulkyNinjaPriceBlock = {
	category: PoeNinjaCategory
	lastSnapshot: number
	items: BulkyNinjaPriceItem[]
}

// ItemPriceDetails
export type BulkyNinjaPriceItem = {
	id: Id<BulkyNinjaPriceItem>
	name: string
	chaos: number
	tendency: number // receiveSparkLine.totalChange (number in percent)
}

// NinjaCurrencyDetails
export type PoeNinjaCurrencyLine = {
	currencyName: string
	chaosEquivalent: number
	detailsId: string
	pay: PoeNinjaLineDetails
	receive: PoeNinjaLineDetails
	paySparkLine: PoeNinjaSparkLine
	receiveSparkLine: PoeNinjaSparkLine
	lowConfidencePaySparkLine: PoeNinjaSparkLine
	lowConfidenceReceiveSparkLine: PoeNinjaSparkLine
}

// NinjaItemDetails
export type PoeNinjaItemLine = {
	id: number
	name: string
	icon: string
	baseType: string
	stackSize: number
	itemClass: number
	sparkline: PoeNinjaSparkLine
	lowConfidenceSparkLine: PoeNinjaSparkLine
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

// Category
export type PoeNinjaCategory =
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

// SparkLineDetails
type PoeNinjaLineDetails = {
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

// SparkLine
type PoeNinjaSparkLine = {
	data: number[]
	totalChange: number
}
