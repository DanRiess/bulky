import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { BazaarMap, MapTier, MapType, ShopMap } from './map.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { Ref, computed } from 'vue'
import { PoeMapStack } from '@shared/types/poe.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { MAP_TIER, MAP_TIER_IDX_TO_NAME, MAP_TYPE, MAP_TYPE_IDX_TO_NAME } from './map.const'

export const BULKY_MAPS = {
	generateTypeFromBaseType,
	generateTierFromBaseTier,
	generateMapFromPoeMapStack,
	generateMapNameFromType,
	generateBazaarItemFromDto,
}

function generateTypeFromBaseType(baseType: string): MapType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase().replace('_MAP', '')
	return MAP_TYPE[transformedType]
}

function generateTierFromBaseTier(tier: number): MapTier | undefined {
	return MAP_TIER[`TIER_${tier}`]
}

function generateMapFromPoeMapStack(
	poeMapStack: PoeMapStack,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyItemOverrideRecord>
): ShopMap | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeMapStack.metadata.map.name)
	const tier = generateTierFromBaseTier(poeMapStack.metadata.map.tier)

	if (!type || !tier || !poeMapStack.metadata.items) return

	const map = poeMapStack.metadata.map

	return {
		type,
		tier,
		name: map.name,
		icon: map.image,
		quantity: poeMapStack.metadata.items,
		price: computed(() => {
			return Math.round((prices.value.get(`${type}_${tier}`)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'MAP',
		priceOverride: computed(() => {
			return Math.round((priceOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return priceOverrides.value.get(`${type}_${tier}`)?.selected ?? true
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
