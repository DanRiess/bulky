import { PoeItem } from '@shared/types/poe.types'
import { DELI_ORB_TYPE } from './deliriumOrb.const'
import { DeliriumOrbTier, DeliriumOrbType, ShopDeliriumOrb } from './deliriumOrb.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'

export const BULKY_DELIRIUM_ORBS = {
	generateDeliriumOrbTypeFromBaseType,
	generateDeliriumOrbNameFromType,
	generateDeliriumOrbTier,
	generateDeliriumOrbFromPoeItem,
}

function generateDeliriumOrbTypeFromBaseType(baseType: string): DeliriumOrbType | undefined {
	if (baseType === 'Abyssal Delirium Orb') return DELI_ORB_TYPE.ABYSSAL
	else if (baseType === "Armoursmith's Delirium Orb") return DELI_ORB_TYPE.ARMOURSMITHS
	else if (baseType === "Blacksmith's Delirium Orb") return DELI_ORB_TYPE.BLACKSMITHS
	else if (baseType === 'Blighted Delirium Orb') return DELI_ORB_TYPE.BLIGHTED
	else if (baseType === "Cartographer's Delirium Orb") return DELI_ORB_TYPE.CARTOGRAPHERS
	else if (baseType === "Diviner's Delirium Orb") return DELI_ORB_TYPE.DIVINERS
	else if (baseType === 'Fine Delirium Orb') return DELI_ORB_TYPE.FINE
	else if (baseType === 'Foreboding Delirium Orb') return DELI_ORB_TYPE.FOREBODING
	else if (baseType === 'Fossilised Delirium Orb') return DELI_ORB_TYPE.FOSSILISED
	else if (baseType === 'Fragmented Delirium Orb') return DELI_ORB_TYPE.FRAGMENTED
	else if (baseType === "Jeweller's Delirium Orb") return DELI_ORB_TYPE.JEWELLERS
	else if (baseType === 'Obscured Delirium Orb') return DELI_ORB_TYPE.OBSCURED
	else if (baseType === 'Singular Delirium Orb') return DELI_ORB_TYPE.SINGULAR
	else if (baseType === 'Skittering Delirium Orb') return DELI_ORB_TYPE.SKITTERING
	else if (baseType === "Thaumaturge's Delirium Orb") return DELI_ORB_TYPE.THAUMATURGES
	else if (baseType === 'Timeless Delirium Orb') return DELI_ORB_TYPE.TIMELESS
	else if (baseType === 'Whispering Delirium Orb') return DELI_ORB_TYPE.WHISPERING
	else return undefined
}

function generateDeliriumOrbTier(): DeliriumOrbTier {
	return '0'
}

function generateDeliriumOrbFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopDeliriumOrb | undefined {
	const configStore = useConfigStore()

	const type = generateDeliriumOrbTypeFromBaseType(poeItem.baseType)
	const tier = generateDeliriumOrbTier()

	if (!type || !tier || !poeItem.stackSize) return

	return {
		type: type,
		tier: tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: poeItem.stackSize,
		price: computed(() => {
			return Math.round((prices.value.get(poeItem.baseType)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'DELIRIUM_ORB',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

/**
 * Generate the display name from the type
 * E. g. BLACKSMITHS -> Blacksmith's Delirium Orb
 */
function generateDeliriumOrbNameFromType(type: DeliriumOrbType) {
	return capitalize(type).replace(/s$/, "'s").concat(' Delirium Orb')
}
