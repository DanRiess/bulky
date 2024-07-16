import { BulkyBazaarItemDto, BulkyBazaarMap8ModItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import {
	BazaarMap,
	BazaarMap8Mod,
	Map8ModPerItemAttributes,
	Map8ModPrices,
	MapTier,
	MapType,
	ShopMap,
	ShopMap8Mod,
} from './map.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { Ref, computed } from 'vue'
import { PoeItem } from '@shared/types/poe.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'
import { MAP_MODIFIER_REGEX, MAP_TIER, MAP_TIER_IDX_TO_NAME, MAP_TYPE, MAP_TYPE_IDX_TO_NAME } from './map.const'
import { PoeItemProperty } from '@shared/types/dtoResponse.types'

export const BULKY_MAPS = {
	generateTypeFromBaseType,
	generateTierFromProperty,
	generateMapFromPoeItem,
	generateMap8ModFromPoeItem,
	generateMapNameFromType,
	generateBazaarItemFromDto,
	generateBazaarMap8ModItemFromDto,
	getPerItemAttributes,
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

function generateMap8ModFromPoeItem(poeItem: PoeItem, itemOverrides: Ref<BulkyItemOverrideRecord>): ShopMap8Mod | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTierFromProperty(poeItem.properties)

	if (!type || !tier) return
	// console.log({ itemOverrides, type, tier })

	return {
		type,
		tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: 1,
		price: 0,
		league: configStore.config.league,
		category: 'MAP_8_MOD',
		priceOverride: computed(() => 0),
		priceOverrideMap8Mod: computed<Map8ModPrices>(() => {
			return (
				itemOverrides.value.get(`${type}_${tier}`)?.priceOverrideMap8Mod ?? {
					base: 0,
					quant110: 0,
					quant120: 0,
					avoidRegex: 0,
					addRegex: 0,
				}
			)
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
		allowRegexFilter: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.allowRegexFilter ?? true
		}),
		perItemAttributes: [],
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

function generateBazaarMap8ModItemFromDto(item: BulkyBazaarMap8ModItemDto): BazaarMap8Mod {
	const type = MAP_TYPE_IDX_TO_NAME[item.type]
	const tier = MAP_TIER_IDX_TO_NAME[item.tier]

	return {
		category: 'MAP_8_MOD',
		type,
		tier,
		name: generateMapNameFromType(type),
		quantity: item.qnt,
		priceMap8Mod: item.prc,
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

function getModifiersFromItem(item: PoeItem) {
	const modifiers: number[] = []

	item.explicitMods?.forEach(modifier => {
		const idx = MAP_MODIFIER_REGEX.findIndex(regex => modifier.match(regex))
		if (idx > -1 && !modifiers.includes(idx)) {
			modifiers.push(idx)
		}
	})

	return modifiers
}

function getPerItemAttributes(item: PoeItem): Map8ModPerItemAttributes | undefined {
	const quant = item.properties?.find(p => p.name === 'Item Quantity')?.values[0][0].replace(/[\+%]/g, '')
	const rarity = item.properties?.find(p => p.name === 'Item Rarity')?.values[0][0].replace(/[\+%]/g, '')
	const packSize = item.properties?.find(p => p.name === 'Monster Pack Size')?.values[0][0].replace(/[\+%]/g, '')
	const modifiers = getModifiersFromItem(item)

	if (!quant || !rarity || !packSize) return

	return {
		properties: {
			itemQuantity: parseInt(quant),
			itemRarity: parseInt(rarity),
			packSize: parseInt(packSize),
		},
		modifiers,
	}
}
