import { BulkyItemOverrideInstance, BulkyItemOverrideRecord, BulkyShopItemRecord } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import { EXPEDITION_FACTION, EXPEDITION_FACTION_IDX_TO_NAME } from '@web/categories/expedition/expedition.const'
import {
	ExpeditionFaction,
	ExpeditionTier,
	ExpeditionType,
	ShopExpeditionItem,
} from '@web/categories/expedition/expedition.types'
import { computed, Ref, toValue } from 'vue'
import { BULKY_TRANSFORM } from './transformers'

export function replaceExpeditionLogbooks(
	itemRecord: BulkyShopItemRecord<ShopExpeditionItem>,
	itemOverrides: Ref<BulkyItemOverrideRecord, BulkyItemOverrideRecord>
) {
	// const { itemOverrides } = useItemOverrides('EXPEDITION')
	const replacedItemRecord = new Map<`${ExpeditionType}_${ExpeditionTier}`, ShopExpeditionItem>()
	itemRecord.forEach((shopItem, key) => {
		if (!key.match(/logbook/i)) {
			replacedItemRecord.set(key, shopItem)
			return
		}

		if (!toValue(shopItem.selected)) return

		const stackSizes = calculateLogbookStackSize(shopItem, itemOverrides)

		for (const faction of getKeys(EXPEDITION_FACTION)) {
			const itemOverride = itemOverrides.value.get(`LOGBOOK_${faction}_${shopItem.tier}`)

			if (stackSizes[faction] > 0 && itemOverride && itemOverride.priceOverride > 0) {
				const logbookShopItem: ShopExpeditionItem = {
					type: `LOGBOOK_${faction}`,
					tier: shopItem.tier,
					name: BULKY_TRANSFORM.stringToDisplayValue(`Logbook: ${faction} - ${shopItem.tier}`),
					icon: shopItem.icon,
					quantity: stackSizes[faction],
					price: 0,
					league: shopItem.league,
					category: 'EXPEDITION',
					priceOverride: computed(() => itemOverride.priceOverride),
					selected: shopItem.selected,
				}
				replacedItemRecord.set(`LOGBOOK_${faction}_${shopItem.tier}`, logbookShopItem)
			}
		}
	})

	return replacedItemRecord
}

function calculateLogbookStackSize(
	item: ShopExpeditionItem,
	itemOverrides: Ref<BulkyItemOverrideRecord, BulkyItemOverrideRecord>
) {
	const logbooks: Record<ExpeditionFaction, BulkyItemOverrideInstance | undefined> = {
		DRUIDS_OF_THE_BROKEN_CIRCLE: itemOverrides.value.get(`LOGBOOK_DRUIDS_OF_THE_BROKEN_CIRCLE_${item.tier}`),
		BLACK_SCYTHE_MERCENARIES: itemOverrides.value.get(`LOGBOOK_BLACK_SCYTHE_MERCENARIES_${item.tier}`),
		KNIGHTS_OF_THE_SUN: itemOverrides.value.get(`LOGBOOK_KNIGHTS_OF_THE_SUN_${item.tier}`),
		ORDER_OF_THE_CHALICE: itemOverrides.value.get(`LOGBOOK_ORDER_OF_THE_CHALICE_${item.tier}`),
	}

	const stackSizes = {
		BLACK_SCYTHE_MERCENARIES: 0,
		DRUIDS_OF_THE_BROKEN_CIRCLE: 0,
		ORDER_OF_THE_CHALICE: 0,
		KNIGHTS_OF_THE_SUN: 0,
	}

	if (item.selected === false) return stackSizes

	// Loop through the peritemattributes of this logbook stack and assign to highest faction price.
	item.perItemAttributes?.forEach(attributes => {
		if (!attributes.logbookMods) return

		// Get the index of the highest priced logbook faction in this particular item
		const indexOfHighestPricedLogbook = attributes.logbookMods.reduce((maxIdx, currentFactionIdx, currentIdx, arr) => {
			const maxIdxFaction = EXPEDITION_FACTION_IDX_TO_NAME[arr[maxIdx]]
			const highestPriceLogbook = logbooks[maxIdxFaction]
			const currentFaction = EXPEDITION_FACTION_IDX_TO_NAME[currentFactionIdx]
			const currentLogbook = logbooks[currentFaction]

			return (currentLogbook?.priceOverride ?? 0) > (highestPriceLogbook?.priceOverride ?? 0) ? currentIdx : maxIdx
		}, 0)

		// Get the faction name
		const factionName = EXPEDITION_FACTION_IDX_TO_NAME[attributes.logbookMods[indexOfHighestPricedLogbook]]

		// Add it to the stack size array
		if (factionName) {
			stackSizes[factionName] += 1
		}
	})

	return stackSizes
}
