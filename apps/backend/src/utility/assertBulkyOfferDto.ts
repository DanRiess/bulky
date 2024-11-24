import { validate } from 'uuid'
import { OfferDto } from '../types/offer.types'
import { assertBulkyCategory } from './assertBulkyCategory'
import { assertBulkyItem } from './assertBulkyItem'

/**
 * Validate an uploaded offer.
 */
export function assertBulkyOfferDto(offer: any): offer is OfferDto {
	if (!(typeof offer === 'object' && !Array.isArray(offer) && offer !== null)) return false
	if (!offer.uuid || !validate(offer.uuid)) return false

	if (!offer.version || typeof offer.version !== 'number') return false
	if (!offer.timestamp || typeof offer.timestamp !== 'number') return false
	if (!offer.chaosPerDiv || typeof offer.chaosPerDiv !== 'number') return false
	if (!offer.minimumBuyout || typeof offer.minimumBuyout !== 'number') return false
	if (!offer.account || typeof offer.account !== 'string') return false
	if (!offer.ign || typeof offer.ign !== 'string') return false
	if (!offer.category || !assertBulkyCategory(offer.category)) return false
	if (!offer.league || typeof offer.league !== 'string') return false
	if (!offer.items || !Array.isArray(offer.items) || !offer.items.every((i: unknown) => assertBulkyItem(i))) return false

	return true
}
