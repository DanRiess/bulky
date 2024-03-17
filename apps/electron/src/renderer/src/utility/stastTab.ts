/**
 * This component provides static functions to generate / validate typed Stash Tabs
 */

import { STASH_TYPE, StashType } from '@web/types/stash.types'

function generateStashTabTypeFromDto(type: string): StashType {
	if (type.match(/premium/i)) return STASH_TYPE.PremiumStash
	else if (type.match(/quad/i)) return STASH_TYPE.QuadStash
	else if (type.match(/currency/i)) return STASH_TYPE.CurrencyStash
	else if (type.match(/map/i)) return STASH_TYPE.MapStash
	else if (type.match(/fragment/i)) return STASH_TYPE.FragmentStash
	else if (type.match(/divination/i)) return STASH_TYPE.DivinationCardStash
	else if (type.match(/essence/i)) return STASH_TYPE.EssenceStash
	else if (type.match(/delirium/i)) return STASH_TYPE.DeliriumStash
	else if (type.match(/delve/i)) return STASH_TYPE.DelveStash
	else if (type.match(/blight/i)) return STASH_TYPE.BlightStash
	else if (type.match(/ultimatum/i)) return STASH_TYPE.UltimatumStash
	else return STASH_TYPE.Stash
}

export const BULKY_STASH_TABS = {
	generateStashTabTypeFromDto,
}
