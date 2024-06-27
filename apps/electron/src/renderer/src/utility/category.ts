/**
 * This component provides static functions to generate / validate branded categories.
 */

import { CATEGORY, Category } from '@shared/types/bulky.types'
import { BULKY_DELIRIUM_ORBS } from '@web/categories/deliriumOrb/deliriumOrb.transformers'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.transformers'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.transformers'

function generateCategoryFromDto(category: string): Category | undefined {
	if (category.match(/scarab/i)) {
		return CATEGORY.SCARAB
	} else if (category.match(/essence/i)) {
		return CATEGORY.ESSENCE
	} else if (category.match(/delirium_orb/i)) {
		return CATEGORY.DELIRIUM_ORB
	}
	return undefined
}

function isBaseTypeInCategory(category: Category, baseType: string) {
	if (category === 'ESSENCE') {
		return !!BULKY_ESSENCES.generateTypeFromBaseType(baseType)
	} else if (category === 'SCARAB') {
		return !!BULKY_SCARABS.generateTypeFromBaseType(baseType)
	} else if (category === 'DELIRIUM_ORB') {
		return !!BULKY_DELIRIUM_ORBS.generateTypeFromBaseType(baseType)
	}
	return false
}

export const BULKY_CATEGORIES = {
	generateCategoryFromDto,
	isBaseTypeInCategory,
}
