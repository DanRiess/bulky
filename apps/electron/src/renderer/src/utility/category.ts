/**
 * This component provides static functions to generate / validate branded categories.
 */

import { CATEGORY, Category } from '@shared/types/bulky.types'
import { PoeItem } from '@shared/types/poe.types'
import { BULKY_BESTIARY } from '@web/categories/beastiary/bestiary.transformers'
import { BULKY_CATALYSTS } from '@web/categories/catalyst/catalyst.transformers'
import { BULKY_CURRENCY } from '@web/categories/currency/currency.transformers'
import { BULKY_DELIRIUM_ORBS } from '@web/categories/deliriumOrb/deliriumOrb.transformers'
import { BULKY_DELVE } from '@web/categories/delve/delve.transformers'
import { BULKY_ESSENCES } from '@web/categories/essence/essence.transformers'
import { BULKY_MAPS } from '@web/categories/map/map.transformers'
import { BULKY_SCARABS } from '@web/categories/scarab/scarab.transformers'

function generateCategoryFromDto(category: string): Category | undefined {
	if (category.match(/scarab/i)) {
		return CATEGORY.SCARAB
	} else if (category.match(/essence/i)) {
		return CATEGORY.ESSENCE
	} else if (category.match(/delirium_orb/i)) {
		return CATEGORY.DELIRIUM_ORB
	} else if (category === 'MAP') {
		return CATEGORY.MAP
	} else if (category.match(/8_mod/i)) {
		return CATEGORY.MAP_8_MOD
	} else if (category.match(/bestiary/i)) {
		return CATEGORY.BESTIARY
	} else if (category.match(/delve/i)) {
		return CATEGORY.DELVE
	} else if (category.match(/catalyst/i)) {
		return CATEGORY.CATALYST
	} else if (category.match(/currency/i)) {
		return CATEGORY.CURRENCY
	}
	return undefined
}

function isBaseTypeInCategory(category: Category, item: PoeItem) {
	const baseType = item.baseType

	if (category === 'ESSENCE') {
		return !!BULKY_ESSENCES.generateTypeFromBaseType(baseType)
	} else if (category === 'SCARAB') {
		return !!BULKY_SCARABS.generateTypeFromBaseType(baseType)
	} else if (category === 'DELIRIUM_ORB') {
		return !!BULKY_DELIRIUM_ORBS.generateTypeFromBaseType(baseType)
	} else if (category === 'MAP' || category === 'MAP_8_MOD') {
		return !!BULKY_MAPS.generateTypeFromBaseType(baseType)
	} else if (category === 'BESTIARY') {
		return !!BULKY_BESTIARY.generateTypeFromPoeItem(item)
	} else if (category === 'DELVE') {
		return !!BULKY_DELVE.generateTypeFromBaseType(baseType)
	} else if (category === 'CATALYST') {
		return !!BULKY_CATALYSTS.generateTypeFromBaseType(baseType)
	} else if (category === 'CURRENCY') {
		return !!BULKY_CURRENCY.generateTypeFromBaseType(baseType)
	}
	return false
}

export const BULKY_CATEGORIES = {
	generateCategoryFromDto,
	isBaseTypeInCategory,
}
