import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
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
import { notEmpty } from '@web/utility/notEmpty'

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
					avoidRegex: {
						available: false,
						addedPrice: 0,
					},
					wantedRegex: {
						available: false,
						addedPrice: 0,
					},
					quantityRegex: [
						{
							available: false,
							addedPrice: [110, 0],
						},
					],
					packsizeRegex: [
						{
							available: false,
							addedPrice: [35, 0],
						},
					],
				}
			)
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
		allowRegexFilter: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.allowRegexFilter ?? false
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
		computedQuantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

function generateBazaarMap8ModItemFromDto(item: BulkyBazaarItemDto): BazaarMap8Mod | undefined {
	const type = MAP_TYPE_IDX_TO_NAME[item.type]
	const tier = MAP_TIER_IDX_TO_NAME[item.tier]

	const perItemAttributes = item.pia
		?.map(attrs => {
			if (!attrs.mods || !attrs.props || !attrs.props.iQnt || !attrs.props.iRar || !attrs.props.pckSz) return

			return {
				modifiers: attrs.mods,
				properties: {
					itemQuantity: attrs.props.iQnt,
					itemRarity: attrs.props.iRar,
					packSize: attrs.props.pckSz,
				},
			}
		})
		.filter(notEmpty)

	// Return if the perItemAttributes could not correctly be extracted.
	if (perItemAttributes === undefined || perItemAttributes.length !== item.pia?.length) return

	return {
		category: 'MAP_8_MOD',
		type,
		tier,
		name: generateMapNameFromType(type),
		quantity: item.qnt,
		computedQuantity: item.qnt,
		price: item.prc,
		regex: {
			avoidRegex: item.rgx?.avd,
			wantedRegex: item.rgx?.wnt,
			quantityRegex: item.rgx?.qnt,
			packsizeRegex: item.rgx?.pckSz,
		},
		icon: '',
		perItemAttributes,
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
