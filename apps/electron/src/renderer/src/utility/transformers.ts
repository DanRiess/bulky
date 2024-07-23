import { capitalize } from 'lodash'
import { BULKY_ID } from './typedId'
import { PoeItemDto, PoeItemProperty, PoeStashTabDto } from '@shared/types/dtoResponse.types'
import { PoeItem, PoeStashTab } from '@shared/types/poe.types'
import {
	BulkyShopItem,
	BulkyItemOverrideInstance,
	BulkyBazaarItemDto,
	BulkyItemOverrideOptions,
	PerItemAttributes,
} from '@shared/types/bulky.types'
import { UnwrapRef, toValue } from 'vue'
import { BULKY_FACTORY } from './factory'

function stringToDisplayValue(string: string) {
	const arr = string.split('_')
	const capitalizedArr = arr.map(word => capitalize(word.toLowerCase()))
	return capitalizedArr.join(' ')
}

/**
 * Generate a PoeItem from its corresponding dto.
 */
function itemDtoToPoeItem(item: PoeItemDto, stashTab: PoeStashTab) {
	const poeItem: PoeItem = {
		id: BULKY_ID.generateTypedId(item.id),
		stashTabId: stashTab.id,
		name: item.name,
		baseType: item.baseType,
		icon: item.icon,
		itemLevel: item.itemLevel,
		stackSize: item.stackSize,
		maxStackSize: item.maxStackSize,
		implicitMods: item.implicitMods,
		explicitMods: item.explicitMods,
		ultimatumMods: item.ultimatumMods,
		enchantMods: item.enchantMods,
		properties: item.properties,
		w: item.w,
		h: item.h,
		x: item.x,
		y: item.y,
	}

	return poeItem
}

function mapSubStashToPoeItem(dto: PoeStashTabDto): PoeItem | undefined {
	if (!dto.metadata.items || !dto.metadata.map) {
		console.log(dto)
		return
	}

	const properties: PoeItemProperty[] =
		dto.metadata.map.section === 'special'
			? []
			: [
					{
						name: 'Map Tier',
						values: [[dto.metadata.map.tier.toString(), 0]],
					},
			  ]

	return {
		id: BULKY_ID.generateTypedId(dto.id),
		stashTabId: BULKY_ID.generateTypedId(dto.parent ?? ''),
		name: dto.metadata.map.name,
		baseType: dto.metadata.map.name,
		icon: dto.metadata.map.image,
		itemLevel: 0,
		stackSize: dto.metadata.items,
		maxStackSize: 65536,
		properties,
		w: 1,
		h: 1,
	}
}

/**
 * Extract overridable properties from a BulkyItem.
 * Generates an object that can be used in the item override store in idb.
 */
function bulkyItemToOverrideItem(item: BulkyShopItem, overrides: BulkyItemOverrideOptions): BulkyItemOverrideInstance {
	return {
		type: item.type,
		tier: item.tier,
		priceOverride: overrides.price ?? toValue(item.priceOverride),
		priceOverrideMap8Mod: overrides.priceMap8Mod ?? toValue(item.priceOverrideMap8Mod),
		league: item.league,
		category: item.category,
		selected: overrides.selected ?? toValue(item.selected),
		allowRegexFilter: overrides.allowRegexFilter ?? toValue(item.allowRegexFilter),
	}
}

function bulkyItemToBazaarItemDto(item: BulkyShopItem | UnwrapRef<BulkyShopItem>): BulkyBazaarItemDto | undefined {
	const nameToIdxTypeMap = BULKY_FACTORY.getNameToIdxTypeMap(item.category)
	const nameToIdxTierMap = BULKY_FACTORY.getNameToIdxTierMap(item.category)

	if (nameToIdxTypeMap === undefined || nameToIdxTierMap === undefined) return

	// Calculate the price.
	let price: number

	if (item.priceOverrideMap8Mod) {
		price = toValue(item.priceOverrideMap8Mod).base
	} else {
		price = toValue(item.priceOverride) > 0 ? toValue(item.priceOverride) : toValue(item.price)
	}

	// If the item has no price, it should be filtered out.
	if (price === 0) return

	console.log(item)

	const itemDto: BulkyBazaarItemDto = {
		type: nameToIdxTypeMap[item.type],
		tier: nameToIdxTierMap[item.tier],
		qnt: item.quantity,
		prc: price,
	}

	// Extract perItemAttributes and convert them into the dto type.
	if (item.perItemAttributes) {
		const perItemAttributes: typeof itemDto.pia = item.perItemAttributes.map((attrs: PerItemAttributes) => {
			return {
				...(attrs.modifiers && { mods: attrs.modifiers }),
				...(attrs.properties && {
					props: {
						...(attrs.properties.itemQuantity && { iQnt: attrs.properties.itemQuantity }),
						...(attrs.properties.itemRarity && { iRar: attrs.properties.itemRarity }),
						...(attrs.properties.packSize && { pckSz: attrs.properties.packSize }),
					},
				}),
			}
		})
		itemDto.pia = perItemAttributes
	}

	// Extract regexes and convert them into the dto type.
	if (item.priceOverrideMap8Mod) {
		const override = toValue(item.priceOverrideMap8Mod)
		const quantityRegex = override.quantityRegex
			.map(regex => (regex.available ? regex.addedPrice : undefined))
			.filter(Boolean)
		const packsizeRegex = override.packsizeRegex
			.map(regex => (regex.available ? regex.addedPrice : undefined))
			.filter(Boolean)

		const regexes: typeof itemDto.rgx = {
			...(override.avoidRegex.available && { avd: override.avoidRegex.addedPrice }),
			...(override.wantedRegex.available && { wnt: override.wantedRegex.addedPrice }),
			...(quantityRegex.length > 0 && { qnt: quantityRegex }),
			...(packsizeRegex.length > 0 && { pckSz: packsizeRegex }),
		}

		itemDto.rgx = regexes
	}

	console.log({ itemDto })

	return itemDto
}

export const BULKY_TRANSFORM = {
	bulkyItemToOverrideItem,
	bulkyItemToBazaarItemDto,
	stringToDisplayValue,
	itemDtoToPoeItem,
	mapSubStashToPoeItem,
}
