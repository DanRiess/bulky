import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { BazaarCurrency, CurrencyTier, CurrencyType, ShopCurrency } from './currency.types'
import { CURRENCY_TYPE, CURRENCY_TYPE_IDX_TO_NAME } from './currency.const'

export const BULKY_CURRENCY = {
	generateTypeFromBaseType,
	generateTier,
	generateShopItemFromPoeItem,
	generateNameFromType,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): CurrencyType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return CURRENCY_TYPE[transformedType]
}

function generateTier(): CurrencyTier {
	return '0'
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopCurrency | undefined {
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
			if (type === 'CHAOS_ORB') return 1
			// return Math.round((prices.value.get(poeItem.baseType)?.chaos ?? 0) * 10) / 10
			return prices.value.get(poeItem.baseType)?.chaos ?? 0
		}),
		league: configStore.config.league,
		category: 'CURRENCY',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10000) / 10000
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarCurrency {
	const type = CURRENCY_TYPE_IDX_TO_NAME[item.type]

	return {
		category: 'CURRENCY',
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
 * E. g. DIVINE_ORB -> Divine Orb
 */
function generateNameFromType(type: CurrencyType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
