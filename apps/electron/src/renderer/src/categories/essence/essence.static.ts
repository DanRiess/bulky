/**
 * This component provides static functions in regards to essences.
 */

import { GenericListingItemDto } from '@shared/types/dto.types'
import { ESSENCE_TIER_IDX_TO_NAME, ESSENCE_TYPE } from './essence.const'
import { Essence, EssenceType } from './essence.types'

/** Type a returned Essence type DTO and turn it into an Essence type */
function generateEssenceTypeFromDto(type: string): EssenceType {
	if (type.match(/greed/i)) return ESSENCE_TYPE.GREED
	if (type.match(/contempt/i)) return ESSENCE_TYPE.CONTEMPT
	if (type.match(/hatred/i)) return ESSENCE_TYPE.HATRED
	if (type.match(/woe/i)) return ESSENCE_TYPE.WOE
	if (type.match(/fear/i)) return ESSENCE_TYPE.FEAR
	if (type.match(/anger/i)) return ESSENCE_TYPE.ANGER
	if (type.match(/torment/i)) return ESSENCE_TYPE.TORMENT
	if (type.match(/sorrow/i)) return ESSENCE_TYPE.SORROW
	if (type.match(/rage/i)) return ESSENCE_TYPE.RAGE
	if (type.match(/suffering/i)) return ESSENCE_TYPE.SUFFERING
	if (type.match(/wrath/i)) return ESSENCE_TYPE.WRATH
	if (type.match(/doubt/i)) return ESSENCE_TYPE.DOUBT
	if (type.match(/loathing/i)) return ESSENCE_TYPE.LOATHING
	if (type.match(/zeal/i)) return ESSENCE_TYPE.ZEAL
	if (type.match(/anguish/i)) return ESSENCE_TYPE.ANGUISH
	if (type.match(/spite/i)) return ESSENCE_TYPE.SPITE
	if (type.match(/scorn/i)) return ESSENCE_TYPE.SCORN
	if (type.match(/envy/i)) return ESSENCE_TYPE.ENVY
	if (type.match(/misery/i)) return ESSENCE_TYPE.MISERY
	if (type.match(/dread/i)) return ESSENCE_TYPE.DREAD
	if (type.match(/insanity/i)) return ESSENCE_TYPE.INSANITY
	if (type.match(/horror/i)) return ESSENCE_TYPE.HORROR
	if (type.match(/delirium/i)) return ESSENCE_TYPE.DELIRIUM
	if (type.match(/hysteria/i)) return ESSENCE_TYPE.HYSTERIA
	else return ESSENCE_TYPE.UNSUPPORTED
}

/** Type a returned item DTO and turn it into an Essence item */
function generateEssenceItemFromDto(itemDto: GenericListingItemDto): Essence | null {
	if (!itemDto.tier || itemDto.tier < 0 || itemDto.tier > 8) return null

	return {
		tier: ESSENCE_TIER_IDX_TO_NAME[itemDto.tier],
		quantity: itemDto.quantity,
		price: itemDto.price,
	}
}

export const BULKY_ESSENCES = {
	generateEssenceTypeFromDto,
	generateEssenceItemFromDto,
}
