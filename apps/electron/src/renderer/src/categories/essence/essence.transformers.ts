/**
 * This component provides static functions in regards to essences.
 */

import { ESSENCE_TIER, ESSENCE_TIER_IDX_TO_NAME, ESSENCE_TYPE, ESSENCE_TYPE_IDX_TO_NAME } from './essence.const'
import { ShopEssence, EssenceTier, EssenceType, BazaarEssence } from './essence.types'
import { PoeItem } from '@shared/types/poe.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyBazaarItemDto, BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { Ref, computed } from 'vue'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'

/** Type a returned ShopEssence type DTO and turn it into an ShopEssence type */
function generateTypeFromBaseType(baseType: string): EssenceType | undefined {
	if (baseType.match(/essence of greed/i)) return ESSENCE_TYPE.GREED
	if (baseType.match(/essence of contempt/i)) return ESSENCE_TYPE.CONTEMPT
	if (baseType.match(/essence of hatred/i)) return ESSENCE_TYPE.HATRED
	if (baseType.match(/essence of woe/i)) return ESSENCE_TYPE.WOE
	if (baseType.match(/essence of fear/i)) return ESSENCE_TYPE.FEAR
	if (baseType.match(/essence of anger/i)) return ESSENCE_TYPE.ANGER
	if (baseType.match(/essence of torment/i)) return ESSENCE_TYPE.TORMENT
	if (baseType.match(/essence of sorrow/i)) return ESSENCE_TYPE.SORROW
	if (baseType.match(/essence of rage/i)) return ESSENCE_TYPE.RAGE
	if (baseType.match(/essence of suffering/i)) return ESSENCE_TYPE.SUFFERING
	if (baseType.match(/essence of wrath/i)) return ESSENCE_TYPE.WRATH
	if (baseType.match(/essence of doubt/i)) return ESSENCE_TYPE.DOUBT
	if (baseType.match(/essence of loathing/i)) return ESSENCE_TYPE.LOATHING
	if (baseType.match(/essence of zeal/i)) return ESSENCE_TYPE.ZEAL
	if (baseType.match(/essence of anguish/i)) return ESSENCE_TYPE.ANGUISH
	if (baseType.match(/essence of spite/i)) return ESSENCE_TYPE.SPITE
	if (baseType.match(/essence of scorn/i)) return ESSENCE_TYPE.SCORN
	if (baseType.match(/essence of envy/i)) return ESSENCE_TYPE.ENVY
	if (baseType.match(/essence of misery/i)) return ESSENCE_TYPE.MISERY
	if (baseType.match(/essence of dread/i)) return ESSENCE_TYPE.DREAD
	if (baseType.match(/essence of insanity/i)) return ESSENCE_TYPE.INSANITY
	if (baseType.match(/essence of horror/i)) return ESSENCE_TYPE.HORROR
	if (baseType.match(/essence of delirium/i)) return ESSENCE_TYPE.DELIRIUM
	if (baseType.match(/essence of hysteria/i)) return ESSENCE_TYPE.HYSTERIA
	else return undefined
}

/**
 * Get the tier of an essence based on its name.
 */
function generateTierFromBaseType(baseType: string): EssenceTier | undefined {
	// if (baseType.match(/whispering/i)) return ESSENCE_TIER.WHISPERING
	// else if (baseType.match(/muttering/i)) return ESSENCE_TIER.MUTTERING
	// else if (baseType.match(/weeping/i)) return ESSENCE_TIER.WEEPING
	// else if (baseType.match(/wailing/i)) return ESSENCE_TIER.WAILING
	if (baseType.match(/screaming/i)) return ESSENCE_TIER.SCREAMING
	else if (baseType.match(/shrieking/i)) return ESSENCE_TIER.SHRIEKING
	else if (baseType.match(/deafening/i)) return ESSENCE_TIER.DEAFENING
	else if (baseType.match(/insanity|horror|delirium|hysteria/i)) return ESSENCE_TIER.TIER_8
	else return undefined
}

function generateEssenceFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyItemOverrideRecord>
): ShopEssence | undefined {
	const configStore = useConfigStore()

	const type = generateTypeFromBaseType(poeItem.baseType)
	const tier = generateTierFromBaseType(poeItem.baseType)

	if (!type || !tier || !poeItem.stackSize) return

	return {
		type: type,
		tier: tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: poeItem.stackSize,
		price: computed(() => {
			return Math.round((prices.value.get(poeItem.baseType)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'ESSENCE',
		priceOverride: computed(() => {
			return Math.round((priceOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return priceOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarEssence {
	const type = ESSENCE_TYPE_IDX_TO_NAME[item.type]
	const tier = ESSENCE_TIER_IDX_TO_NAME[item.tier]

	return {
		category: 'ESSENCE',
		type,
		tier,
		name: generateEssenceNameFromTypeAndTier(type, tier),
		quantity: item.qnt,
		price: item.prc,
		icon: '',
	}
}

function generateEssenceNameFromTypeAndTier(type: EssenceType, tier: EssenceTier) {
	if (type === 'HYSTERIA' || type === 'DELIRIUM' || type === 'INSANITY' || type === 'HORROR') {
		return `Essence of ${capitalize(type)}`
	}
	return `${capitalize(tier)} E. of ${capitalize(type)}`
}

export const BULKY_ESSENCES = {
	generateTypeFromBaseType,
	generateTierFromBaseType,
	generateEssenceFromPoeItem,
	generateEssenceNameFromTypeAndTier,
	generateBazaarItemFromDto,
}
