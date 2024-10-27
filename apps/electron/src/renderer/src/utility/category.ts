/**
 * This component provides static functions to generate / validate branded categories.
 */

import { CATEGORY, Category } from '@shared/types/bulky.types'

function generateCategoryFromDto(category: string): Category | undefined {
	if (category.match(/scarab/i)) return CATEGORY.SCARAB
	else if (category.match(/essence/i)) return CATEGORY.ESSENCE
	else if (category.match(/delirium_orb/i)) return CATEGORY.DELIRIUM_ORB
	else if (category === 'MAP') return CATEGORY.MAP
	else if (category.match(/8_mod/i)) return CATEGORY.MAP_8_MOD
	else if (category.match(/bestiary/i)) return CATEGORY.BESTIARY
	else if (category.match(/delve/i)) return CATEGORY.DELVE
	else if (category.match(/catalyst/i)) return CATEGORY.CATALYST
	else if (category.match(/currency/i)) return CATEGORY.CURRENCY
	else if (category.match(/heist/i)) return CATEGORY.HEIST
	else if (category.match(/expedition/i)) return CATEGORY.EXPEDITION

	return undefined
}

export const BULKY_CATEGORIES = {
	generateCategoryFromDto,
}
