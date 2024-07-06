import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { BazaarMap, MapTier, MapType, ShopMap } from './map.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { Ref, computed } from 'vue'
import { PoeItem } from '@shared/types/poe.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { MAP_TIER, MAP_TIER_IDX_TO_NAME, MAP_TYPE, MAP_TYPE_IDX_TO_NAME } from './map.const'
import { PoeItemProperty } from '@shared/types/dtoResponse.types'

export const BULKY_MAPS = {
	generateTypeFromBaseType,
	generateTierFromProperty,
	generateMapFromPoeItem,
	generateMapNameFromType,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): MapType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase().replace('_MAP', '')
	return MAP_TYPE[transformedType]
}

function generateTierFromProperty(properties?: PoeItemProperty[]): MapTier | undefined {
	const tierProperty = properties?.find(p => p.name === 'Map Tier')
	if (!tierProperty) return MAP_TIER.TIER_16

	const tier = tierProperty.values[0][0]
	return MAP_TIER[`TIER_${tier}`]
}

function generateMapFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopMap | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTierFromProperty(poeItem.properties)

	if (!type || !tier || !poeItem.stackSize) return

	return {
		type,
		tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: poeItem.stackSize,
		price: computed(() => {
			return Math.round((prices.value.get(`${poeItem.baseType}_${tier}`)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'MAP',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarMap {
	const type = MAP_TYPE_IDX_TO_NAME[item.type]
	const tier = MAP_TIER_IDX_TO_NAME[item.tier]

	return {
		category: 'MAP',
		type,
		tier,
		name: generateMapNameFromType(type),
		quantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

function generateMapNameFromType(type: MapType) {
	return (
		type
			.split('_')
			.map(t => capitalize(t))
			.join(' ') + ' Map'
	)
}
