import { PoeItem } from '@shared/types/poe.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyBazaarOffer, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash-es'
import { BazaarFragment, FragmentSet, FragmentTier, FragmentType, ShopFragment } from './fragment.types'
import { FRAGMENT_SET, FRAGMENT_TYPE, FRAGMENT_TYPE_IDX_TO_NAME } from './fragment.const'
import { getKeys } from '@shared/types/utility.types'
import { notEmpty } from '@web/utility/notEmpty'

export const BULKY_FRAGMENT = {
	generateTypeFromBaseType,
	generateTier,
	generateShopItemFromPoeItem,
	generateNameFromType,
	generateBazaarItemFromDto,
	generateItemSetsFromOffer,
}

function generateTypeFromBaseType(baseType: string): FragmentType | undefined {
	const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
	return FRAGMENT_TYPE[transformedType]
}

function generateTier(): FragmentTier {
	return '0'
}

function generateShopItemFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopFragment | undefined {
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
			return prices.value.get(poeItem.baseType)?.chaos ?? 0
		}),
		league: configStore.config.league,
		category: 'FRAGMENT',
		priceOverride: computed(() => {
			return Math.round((itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10000) / 10000
		}),
		selected: computed(() => {
			return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarFragment | undefined {
	const type = FRAGMENT_TYPE_IDX_TO_NAME[item.type]
	if (!type) return

	return {
		category: 'FRAGMENT',
		type,
		tier: '0',
		name: generateNameFromType(type),
		quantity: item.qnt,
		computedQuantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

function generateItemSetsFromOffer(offer: BulkyBazaarOffer): BazaarFragment[] {
	const setKeys = getKeys(FRAGMENT_SET)

	return setKeys
		.map(setKey => {
			const necessaryItems = FRAGMENT_SET[setKey]

			let maxQuantity = Infinity
			let setPrice = 0

			const allItemsAvailable = necessaryItems.every(necessaryItem => {
				const itemInOffer = offer.items.find(item => item.type === necessaryItem)
				if (!itemInOffer) return false

				maxQuantity = Math.min(maxQuantity, itemInOffer.quantity)
				setPrice += itemInOffer.price

				return true
			})

			if (allItemsAvailable) {
				const bazaarFragment: BazaarFragment = {
					category: 'FRAGMENT',
					type: setKey,
					tier: '0',
					name: generateNameFromType(setKey),
					quantity: maxQuantity,
					computedQuantity: maxQuantity,
					price: setPrice,
					icon: '',
				}
				return bazaarFragment
			} else {
				return undefined
			}
		})
		.filter(notEmpty)
}

/**
 * Generate the display name from the type
 * E. g. SACRIFICE_AT_DAWN -> Sacrifice At Dawn
 */
function generateNameFromType(type: FragmentType | FragmentSet) {
	const isSet = !!FRAGMENT_SET[type]

	const str = type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')

	return isSet ? str + ' Set' : str
}
