import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { BazaarBeast, BeastTier, BeastType, ShopBeast } from './bestiary.type'
import { BEAST_TYPE, BEAST_TYPE_IDX_TO_NAME } from './bestiary.const'

export const BULKY_BESTIARY = {
	generateTypeFromBaseType,
	generateBeastNameFromType,
	generateTier,
	generateBeastFromPoeItem,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): BeastType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return BEAST_TYPE[transformedType]
}

function generateTier(): BeastTier {
	return '0'
}

function generateBeastFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopBeast | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTier()

	if (!type || !tier) return

	return {
		type: type,
		tier: tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: 1,
		price: computed(() => {
			return Math.round((prices.value.get(poeItem.baseType)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'BESTIARY',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarBeast {
	const type = BEAST_TYPE_IDX_TO_NAME[item.type]

	return {
		category: 'BESTIARY',
		type,
		tier: '0',
		name: generateBeastNameFromType(type),
		quantity: item.qnt,
		computedQuantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

/**
 * Generate the display name from the type.
 */
function generateBeastNameFromType(type: BeastType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
