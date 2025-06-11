import { PoeItem } from '@shared/types/poe.types'
import { SCARAB_TYPE, SCARAB_TYPE_IDX_TO_NAME } from './scarab.const'
import { BazaarScarab, ScarabTier, ScarabType, ShopScarab } from './scarab.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash-es'

export const BULKY_SCARABS = {
	generateTypeFromBaseType,
	generateTier,
	generateShopItemFromPoeItem,
	generateNameFromType,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): ScarabType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return SCARAB_TYPE[transformedType]
}

function generateTier(): ScarabTier {
	return '0'
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopScarab | undefined {
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
		category: 'SCARAB',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarScarab | undefined {
	const type = SCARAB_TYPE_IDX_TO_NAME[item.type]
	if (!type) return

	return {
		category: 'SCARAB',
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
 * E. g. SCARAB_OF_WISPS -> Scarab Of Wisps
 */
function generateNameFromType(type: ScarabType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
