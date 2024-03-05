import { ObjectValues } from './utitlity.types'

export const LEAGUE = {
	UNSUPPORTED: 'UNSUPPORTED',
	STANDARD_SC: 'STANDARD_SC',
	STANDARD_HC: 'STANDARD_HC',
	AFFLICTION_SC: 'AFFLICTION_SC',
	AFFLICTION_HC: 'AFFLICTION_HC',
} as const

export type League = ObjectValues<typeof LEAGUE>
