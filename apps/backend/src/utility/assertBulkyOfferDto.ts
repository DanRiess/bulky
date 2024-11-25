import { validate } from 'uuid'
import { OfferDto } from '../types/offer.types'
import { assertBulkyCategory } from './assertBulkyCategory'
import { assertBulkyItem } from './assertBulkyItem'

/**
 * Validate an uploaded offer.
 */
export function assertBulkyOfferDto(offer: any): offer is OfferDto {
	if (!(typeof offer === 'object' && !Array.isArray(offer) && offer !== null)) return false
	if (!validate(offer.uuid)) return false

	if (typeof offer.version !== 'number') return false
	if (typeof offer.timestamp !== 'number') return false
	if (typeof offer.chaosPerDiv !== 'number') return false
	if (typeof offer.minimumBuyout !== 'number') return false
	if (typeof offer.account !== 'string') return false
	if (typeof offer.ign !== 'string') return false
	if (!assertBulkyCategory(offer.category)) return false
	if (typeof offer.league !== 'string') return false
	if (!Array.isArray(offer.items) || !offer.items.every((i: unknown) => assertBulkyItem(i))) return false

	return true
}
