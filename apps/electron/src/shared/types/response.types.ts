import { StashTabListItemDto } from './dto.types'
import { PoeItem, PoeLeague } from './poe.types'

export type PoeLeagueResponse = {
	leagues: PoeLeague[]
}

export type PoeStashListResponse = {
	stashes: StashTabListItemDto[]
}

export type PoeStashItemResponse = {
	items: PoeItem[]
}
