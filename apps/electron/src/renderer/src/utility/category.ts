/**
 * This component provides static functions to generate / validate branded categories.
 */

import { CATEGORY, Category } from '@web/types/bulky.types'

function generateCategoryFromDto(category: string): Category {
	if (category.match(/compass/i)) {
		return CATEGORY.COMPASS
	} else if (category.match(/scarab/i)) {
		return CATEGORY.SCARAB
	} else if (category.match(/essence/i)) {
		return CATEGORY.ESSENCE
	} else {
		return CATEGORY.UNSUPPORTED
	}
}

export const BULKY_CATEGORIES = {
	generateCategoryFromDto,
}
