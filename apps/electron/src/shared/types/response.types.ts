import { StashTabDto, StashTabListItemDto } from './dto.types'
import { PoeItem, PoeLeague } from './poe.types'

export type PoeLeagueResponse = {
	leagues: PoeLeague[]
}

export type PoeStashTabListResponse = {
	stashes: StashTabListItemDto[]
}

export type PoeStashTabResponse = {
	stash: StashTabDto
}
