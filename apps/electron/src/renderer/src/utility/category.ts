/**
 * This component provides static functions to generate / validate branded categories.
 */

import { CATEGORY, Category } from '@shared/types/bulky.types'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.static'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.static'

function generateCategoryFromDto(category: string): Category | undefined {
	if (category.match(/scarab/i)) {
		return CATEGORY.SCARAB
	} else if (category.match(/essence/i)) {
		return CATEGORY.ESSENCE
	}
	return undefined
}

function isBaseTypeInCategory(category: Category, baseType: string) {
	if (category === 'ESSENCE') {
		const essenceType = BULKY_ESSENCES.generateEssenceTypeFromName(baseType)
		return essenceType !== 'UNSUPPORTED'
	} else if (category === 'SCARAB') {
		return !!BULKY_SCARABS.generateScarabTypeFromBaseType(baseType)
	}
	return false
}

export const BULKY_CATEGORIES = {
	generateCategoryFromDto,
	isBaseTypeInCategory,
}
