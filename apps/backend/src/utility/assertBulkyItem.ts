import { BulkyItemDto } from '../types/offer.types'

/**
 * Validate an item from an uploaded offer.
 */
export function assertBulkyItem(item: any): item is BulkyItemDto {
	if (!item) return false

	// Handle per item attributes if they are present.
	if ('pia' in item) {
		if (
			!item.pia.every((pia: unknown) => {
				if (typeof pia !== 'object' || pia === null) return false

				if ('mods' in pia) {
					if (!Array.isArray(pia.mods)) return false
					if (!pia.mods.every((m: unknown) => typeof m === 'number')) return false
				}

				if ('logbookMods' in pia) {
					if (!Array.isArray(pia.logbookMods)) return false
					if (!pia.logbookMods.every((m: unknown) => typeof m === 'number')) return false
				}

				if ('props' in pia) {
					if (typeof pia.props !== 'object' || pia.props === null) return false
					if ('iQnt' in pia.props && typeof pia.props.iQnt !== 'number') return false
					if ('iRar' in pia.props && typeof pia.props.iRar !== 'number') return false
					if ('pckSz' in pia.props && typeof pia.props.pckSz !== 'number') return false
				}

				return true
			})
		) {
			return false
		}
	}

	// Handle regex attributes if they are present.
	if ('rgx' in item) {
		if ('avd' in item.rgx && typeof item.rgx.avd !== 'number') return false
		if ('wnt' in item.rgx && typeof item.rgx.wnt !== 'number') return false

		// If present, must be type [[quantity(number), addedPrice(number)], ...]
		if ('qnt' in item.rgx) {
			if (!Array.isArray(item.rgx.qnt)) return false
			if (
				!item.rgx.qnt.every((qntItem: unknown) => {
					// Every subarray must be an array, have length 2 and be of type [number, number]
					if (!Array.isArray(qntItem)) return false
					if (qntItem.length !== 2 || !qntItem.every(el => typeof el === 'number')) return false
					return true
				})
			) {
				return false
			}
		}

		// If present, must be type [[packSize(number), addedPrice(number)], ...]
		if ('pckSz' in item.rgx) {
			if (!Array.isArray(item.rgx.pckSz)) return false
			if (
				!item.rgx.pckSz.every((packSizeItem: unknown) => {
					// Every subarray must be an array, have length 2 and be of type [number, number]
					if (!Array.isArray(packSizeItem)) return false
					if (packSizeItem.length !== 2 || !packSizeItem.every(el => typeof el === 'number')) return false
					return true
				})
			) {
				return false
			}
		}
	}

	return (
		'type' in item &&
		typeof item.type === 'number' &&
		'tier' in item &&
		typeof item.tier === 'number' &&
		'qnt' in item &&
		typeof item.qnt === 'number' &&
		'prc' in item &&
		typeof item.prc === 'number'
	)
}
