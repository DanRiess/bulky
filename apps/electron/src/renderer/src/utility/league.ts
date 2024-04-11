/**
 * This component provides static functions to generate / validate typed Leagues
 */

import { LEAGUE, League } from '@shared/types/poe.types'

function generateLeagueFromDto(league: string): League {
	if (league.match(/affliction/i)) {
		return league.match(/hc/i) ? LEAGUE.AFFLICTION_HC : LEAGUE.AFFLICTION_SC
	} else if (league.match(/standard/i)) {
		return league.match(/hc/i) ? LEAGUE.STANDARD_HC : LEAGUE.STANDARD_SC
	} else {
		return LEAGUE.UNSUPPORTED
	}
}

export const BULKY_LEAGUES = {
	generateLeagueFromDto,
}
