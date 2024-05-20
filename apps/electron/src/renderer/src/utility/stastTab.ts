/**
 * This component provides static functions to generate / validate typed Stash Tabs
 */

import { POE_STASH_TYPE, PoeStashType } from '@shared/types/poe.types'

function generateStashTabTypeFromDto(type: string): PoeStashType {
	if (type.match(/folder/i)) return POE_STASH_TYPE.Folder
	else if (type.match(/premium/i)) return POE_STASH_TYPE.PremiumStash
	else if (type.match(/quad/i)) return POE_STASH_TYPE.QuadStash
	else if (type.match(/currency/i)) return POE_STASH_TYPE.CurrencyStash
	else if (type.match(/map/i)) return POE_STASH_TYPE.MapStash
	else if (type.match(/fragment/i)) return POE_STASH_TYPE.FragmentStash
	else if (type.match(/divination/i)) return POE_STASH_TYPE.DivinationCardStash
	else if (type.match(/essence/i)) return POE_STASH_TYPE.EssenceStash
	else if (type.match(/delirium/i)) return POE_STASH_TYPE.DeliriumStash
	else if (type.match(/delve/i)) return POE_STASH_TYPE.DelveStash
	else if (type.match(/blight/i)) return POE_STASH_TYPE.BlightStash
	else if (type.match(/ultimatum/i)) return POE_STASH_TYPE.UltimatumStash
	else return POE_STASH_TYPE.NormalStash
}

export const BULKY_STASH_TABS = {
	generateStashTabTypeFromDto,
}
