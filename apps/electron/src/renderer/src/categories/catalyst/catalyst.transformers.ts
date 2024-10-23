import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { BazaarCatalyst, CatalystTier, CatalystType, ShopCatalyst } from './catalyst.types'
import { CATALYST_TYPE, CATALYST_TYPE_IDX_TO_NAME } from './catalyst.const'

export const BULKY_CATALYSTS = {
	generateTypeFromBaseType,
	generateTier,
	generateCatalystFromPoeItem,
	generateCatalystNameFromType,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): CatalystType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return CATALYST_TYPE[transformedType]
}

function generateTier(): CatalystTier {
	return '0'
}

function generateCatalystFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopCatalyst | undefined {
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
		category: 'CATALYST',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarCatalyst {
	const type = CATALYST_TYPE_IDX_TO_NAME[item.type]

	return {
		category: 'CATALYST',
		type,
		tier: '0',
		name: generateCatalystNameFromType(type),
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
function generateCatalystNameFromType(type: CatalystType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
