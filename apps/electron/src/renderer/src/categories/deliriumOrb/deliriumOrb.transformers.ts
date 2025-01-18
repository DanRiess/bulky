import { PoeItem } from '@shared/types/poe.types'
import { DELI_ORB_TYPE, DELI_ORB_TYPE_IDX_TO_NAME } from './deliriumOrb.const'
import { BazaarDeliriumOrb, DeliriumOrbTier, DeliriumOrbType, ShopDeliriumOrb } from './deliriumOrb.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'

export const BULKY_DELIRIUM_ORBS = {
	generateTypeFromBaseType,
	generateNameFromType,
	generateTier,
	generateShopItemFromPoeItem,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): DeliriumOrbType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return DELI_ORB_TYPE[transformedType]
}

function generateTier(): DeliriumOrbTier {
	return '0'
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopDeliriumOrb | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTier()

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

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarDeliriumOrb | undefined {
	const type = DELI_ORB_TYPE_IDX_TO_NAME[item.type]
	if (!type) return

	return {
		category: 'DELIRIUM_ORB',
		type,
		tier: '0',
		name: generateNameFromType(type),
		quantity: item.qnt,
		computedQuantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

/**
 * Generate the display name from the type
 * E. g. BLACKSMITHS -> Blacksmith's Delirium Orb
 */
function generateNameFromType(type: DeliriumOrbType) {
	return capitalize(type).replace(/s$/, "'s").concat(' Delirium Orb')
}
