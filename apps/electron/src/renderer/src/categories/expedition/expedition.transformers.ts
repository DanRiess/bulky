import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { Ref, computed } from 'vue'
import { PoeItem } from '@shared/types/poe.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash-es'
import { notEmpty } from '@web/utility/notEmpty'
import {
	EXPEDITION_FACTION,
	EXPEDITION_FACTION_NAME_TO_IDX,
	EXPEDITION_TIER,
	EXPEDITION_TIER_IDX_TO_NAME,
	EXPEDITION_TYPE,
	EXPEDITION_TYPE_IDX_TO_NAME,
} from './expedition.const'
import {
	BazaarExpeditionItem,
	ExpeditionFaction,
	ExpeditionTier,
	ExpeditionType,
	LogbookPerItemAttributes,
	ShopExpeditionItem,
} from './expedition.types'

export const BULKY_EXPEDITION = {
	generateTypeFromBaseType,
	generateTierFromProperty,
	generateShopItemFromPoeItem,
	generateNameFromType,
	generateBazaarItemFromDto,
	getPerItemAttributes,
}

/**
 * Only used for shop items, so the specific logbook types do not need to be considered here.
 */
function generateTypeFromBaseType(baseType: string): ExpeditionType | undefined {
	const transformedType = baseType.replace('Expedition ', '').replace(/\s/g, '_').toUpperCase()
	return EXPEDITION_TYPE[transformedType]
}

function generateTierFromProperty(ilvl?: number): ExpeditionTier | undefined {
	// Currencies
	if (!ilvl || ilvl === 0) return EXPEDITION_TIER['0']

	// Logbooks
	if (ilvl < 68) return undefined
	else if (ilvl < 73) return EXPEDITION_TIER['ILVL_68-72']
	else if (ilvl < 78) return EXPEDITION_TIER['ILVL_73-77']
	else if (ilvl < 83) return EXPEDITION_TIER['ILVL_78-82']
	return EXPEDITION_TIER['ILVL_83+']
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopExpeditionItem | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTierFromProperty(poeItem.ilvl)

	if (!type || !tier) return

	return {
		type,
		tier,
		name: type.match(/logbook/i) ? `${poeItem.baseType} (${generateNameFromTier(tier)})` : poeItem.baseType,
		icon: poeItem.icon,
		quantity: poeItem.stackSize ?? 1,
		price: computed(() => {
			return Math.round((prices.value.get(`${poeItem.baseType}_${tier}`)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'EXPEDITION',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
		perItemAttributes: type === 'LOGBOOK' ? [] : undefined,
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarExpeditionItem | undefined {
	const type = EXPEDITION_TYPE_IDX_TO_NAME[item.type]
	const tier = EXPEDITION_TIER_IDX_TO_NAME[item.tier]
	if (!type || !tier) return

	return {
		category: 'EXPEDITION',
		type,
		tier,
		name: generateNameFromType(type),
		quantity: item.qnt,
		computedQuantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

function generateNameFromType(type: ExpeditionType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}

function generateNameFromTier(tier: ExpeditionTier) {
	return tier.replace('_', ' ').toLowerCase()
}

function getPerItemAttributes(item: PoeItem): LogbookPerItemAttributes | undefined {
	const logbookMods = item.logbookMods
	const itemUnusable = item.corrupted || item.split || item.duplicated

	if (itemUnusable || !logbookMods) return

	const mappedMods = logbookMods
		.map(mod => {
			const index = mod.faction.name.replaceAll(' ', '_').toUpperCase()
			const faction = EXPEDITION_FACTION[index] as ExpeditionFaction | undefined
			if (!faction) return
			return EXPEDITION_FACTION_NAME_TO_IDX[faction]
		})
		.filter(notEmpty)

	return {
		itemId: item.id,
		logbookMods: mappedMods,
	}
}
