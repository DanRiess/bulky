import { StashTabListItemDto } from './dto.types'
import { PoeLeague } from './poe.types'

export type PoeLeagueResponse = {
	leagues: PoeLeague[]
}

export type PoeStashListResponse = {
	stashes: StashTabListItemDto[]
}
