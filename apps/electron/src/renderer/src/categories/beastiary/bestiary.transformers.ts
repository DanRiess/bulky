import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { BazaarBeast, BeastTier, BeastType, ShopBeast } from './bestiary.types'
import { BEAST_TYPE, BEAST_TYPE_IDX_TO_NAME } from './bestiary.const'

export const BULKY_BESTIARY = {
	generateTypeFromPoeItem,
	generateBeastNameFromType,
	generateTier,
	generateBeastFromPoeItem,
	generateBazaarItemFromDto,
}

function generateTypeFromPoeItem(item: PoeItem): BeastType | undefined {
	const baseType = item.baseType
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()

	// This is a red beast.
	if (BEAST_TYPE[transformedType]) return BEAST_TYPE[transformedType]

	// Check if item is a yellow beast instead.
	// Yellow beasts must have 3 properties named Genus, Group and Family
	const necessaryProperties = ['Genus', 'Group', 'Family']
	const itemProperties = item.properties?.map(prop => prop.name)

	// Check if itemProperties has every necessary property.
	if (itemProperties && necessaryProperties.every(necessaryProp => itemProperties.includes(necessaryProp))) {
		return BEAST_TYPE['YELLOW_BEAST']
	}

	return undefined
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

	const type = generateTypeFromPoeItem(poeItem)
	const tier = generateTier()

	if (!type || !tier) return

	return {
		type: type,
		tier: tier,
		name: type === 'YELLOW_BEAST' ? 'Yellow Beast' : poeItem.baseType,
		icon: poeItem.icon,
		quantity: 1,
		price: computed(() => {
			if (type === 'YELLOW_BEAST') {
				return 0
			}
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
