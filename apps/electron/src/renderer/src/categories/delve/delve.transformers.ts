import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash-es'
import { BazaarDelveItem, DelveTier, DelveType, ShopDelveItem } from './delve.types'
import { DELVE_TYPE, DELVE_TYPE_IDX_TO_NAME } from './delve.const'

export const BULKY_DELVE = {
	generateTypeFromBaseType,
	generateTier,
	generateBazaarItemFromDto,
	generateShopItemFromPoeItem,
	generateNameFromType,
}

function generateTypeFromBaseType(baseType: string): DelveType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return DELVE_TYPE[transformedType]
}

function generateTier(): DelveTier {
	return '0'
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopDelveItem | undefined {
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
		category: 'DELVE',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarDelveItem | undefined {
	const type = DELVE_TYPE_IDX_TO_NAME[item.type]
	if (!type) return

	return {
		category: 'DELVE',
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
 * Generate the display name from the type.
 */
function generateNameFromType(type: DelveType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
