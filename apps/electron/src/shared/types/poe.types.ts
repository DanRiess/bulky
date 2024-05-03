export const enum PoeDisplayMode {
	'Name should be followed by values' = 0,
	'Values should be followed by name',
	'Progress bar',
	'Values should be inserted into the string by index',
	'Separator',
}

export const enum PoeFrameType {
	'Normal frame',
	'Magic frame',
	'Rare frame',
	'Unique frame',
	'Gem frame',
	'Currency frame',
	'Divination Card frame',
	'Quest Frame',
	'Prophecy frame',
	'Foil frame',
	'Supporter Foil frame',
}

export type PoeItemProperty = {
	name: string
	values: [string, number][]
	displayMode?: PoeDisplayMode
	progress?: number
	type?: number
	suffix?: string
}

export type PoeItemSocket = {
	group: number
	attr?: 'S' | 'D' | 'I' | 'G' | 'A' | 'DV'
	sColour?: 'R' | 'G' | 'B' | 'W' | 'A' | 'DV'
}

export type PoeInfluences = {
	shaper?: boolean
	elder?: boolean
	searing?: boolean
	tangled?: boolean
	hunter?: boolean
	conqueror?: boolean
	redeemer?: boolean
	warlord?: boolean
}

export type PoeRarity = 'Normal' | 'Magic' | 'Rare' | 'Unique'

export type PoeCrucibleNode = {
	skill?: number
	tier?: number
	icon?: string
	allocated?: boolean
	isNotable?: boolean
	isReward?: boolean
	stats?: string[]
	reminderText?: string[]
	orbit?: number
	orbitIndex?: number
	out: string[]
	in: string[]
}

export type PoeItem = {
	verified: boolean
	w: number
	h: number
	icon: string
	support?: boolean
	stackSize?: number
	maxStackSize?: number
	stackSizeText?: string
	league?: string
	id: string
	influences: PoeInfluences
	shaper?: boolean
	elder?: boolean
	searing?: boolean
	tangled?: boolean
	abyssJewel?: boolean
	delve?: boolean
	fractured?: boolean
	synthesised?: boolean
	sockets?: PoeItemSocket[]
	socketedItems?: PoeItem[]
	name: string
	typeLine: string
	baseType: string
	rarity?: PoeRarity
	identified: boolean
	itemLevel?: number
	ilvl: number // deprecated
	note?: string
	forum_note?: string
	lockedToCharacter?: boolean
	lockedToAccount?: boolean
	duplicated?: boolean
	split?: boolean
	corrupted?: boolean
	unmodifiable?: boolean
	cisRaceReward?: boolean
	seaRaceReward?: boolean
	thRaceReward?: boolean
	properties?: PoeItemProperty[]
	notableProperties?: PoeItemProperty[]
	requirements?: PoeItemProperty[]
	additionalProperties?: PoeItemProperty[]
	nextLevelRequirements?: PoeItemProperty[]
	talismanTier?: number
	rewards?: {
		label: string
		rewards: Record<string, number>
	}
	secDescrText?: string
	utilityMods?: string[]
	logbookMods?: {
		name: string
		faction: {
			id: 'Faction1' | 'Faction2' | 'Faction3' | 'Faction4'
			name: string
		}
		mods: string[]
	}
	enchantMods?: string[]
	scourgeMods?: string[]
	implicitMods?: string[]
	ultimatumMods?: {
		type: string
		tier: number
	}
	explicitMods?: string[]
	craftedMods?: string[]
	fracturedMods?: string[]
	crucibleMods?: string[]
	cosmeticMods?: string[]
	veiledMods?: string[]
	veiled?: boolean
	descrText?: string
	flavourText?: string[]
	flavourTextParsed?: (string | object)[]
	flavourTextNote?: string
	prophecyText?: string
	isRelic?: boolean
	foilVariation?: number
	replica?: boolean
	foreseeing?: boolean
	incubatedItem?: {
		name: string
		level: number
		progress: number
		total: number
	}
	scourged?: {
		tier: number
		level?: number
		progress?: number
		total?: number
	}
	crucible?: {
		layout: string
		nodes: Record<string, PoeCrucibleNode>
	}
	ruthless?: boolean
	frameType: PoeFrameType
	artFilename?: string
	hybrid?: {
		isVaalGem?: boolean
		baseTypeName: string
		properties?: PoeItemProperty[]
		explicitMods?: string[]
		secDescrText?: string
	}
	extended?: {
		category?: string
		subcategories?: string[]
		prefixes?: number
		suffixes?: number
	}
	x?: number
	y?: number
	inventoryId?: string
	socket?: number
	colour?: 'S' | 'D' | 'I' | 'G'
}

export type PoeLeague = {
	id: string
	realm: string
	url: string
	startAt: string
	endAt: string | null
	description: string
	category: {
		id: string
		current?: boolean
	}
	registerAt: string
	delveEvent: boolean
	rules: PoeLeagueRule[]
}

interface PoeLeagueRule {
	id: string
	name: string
	description: string
}

export class SSFRule implements PoeLeagueRule {
	id = 'NoParties'
	name = 'Solo'
	description = 'You may not party in this league.'

	// enables instanceof checks for objects that haven't been instantiated with this constructor but follow the schema
	static [Symbol.hasInstance](obj: any) {
		if (!obj) return false

		return obj.id === 'NoParties' && obj.name === 'Solo' && obj.description === 'You may not party in this league.'
	}
}

export class RuthlessRule implements PoeLeagueRule {
	id = 'HardMode'
	name = 'Ruthless'
	description = 'A significantly different game experience with extreme item scarcity, among other changes.'

	// enables instanceof checks for objects that haven't been instantiated with this constructor but follow the schema
	static [Symbol.hasInstance](obj: any) {
		if (!obj) return false

		return (
			obj.id === 'HardMode' &&
			obj.name === 'Ruthless' &&
			obj.description === 'A significantly different game experience with extreme item scarcity, among other changes.'
		)
	}
}
