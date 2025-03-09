export type PoeLeagueRecordDto = {
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
	rules: PoeLeagueRecordRule[]
}

interface PoeLeagueRecordRule {
	id: string
	name: string
	description: string
}

export class SSFRule implements PoeLeagueRecordRule {
	id = 'NoParties'
	name = 'Solo'
	description = 'You may not party in this league.'

	// enables instanceof checks for objects that haven't been instantiated with this constructor but follow the schema
	static [Symbol.hasInstance](obj: any) {
		if (!obj) return false

		return obj.id === 'NoParties' && obj.name === 'Solo' && obj.description === 'You may not party in this league.'
	}
}

export class RuthlessRule implements PoeLeagueRecordRule {
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
