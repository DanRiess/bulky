export type ProcessedNinjaCategory = {
	category: NinjaCategory
	items: NinjaArrayItem[]
}

export type NinjaArrayItem = [string, number, number | undefined]

export type NinjaDenseDto = {
	currencyOverviews: {
		type: Extract<NinjaCategory, 'Currency' | 'Fragment'>
		lines: {
			name: string
			chaos: number
			graph: number[]
		}[]
	}[]
	itemOverviews: {
		type: Exclude<NinjaCategory, 'Currency' | 'Fragment'>
		lines: {
			name: string
			variant?: string
			chaos: number
			graph: number[]
		}[]
	}[]
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
