import { Category } from '../types/offer.types'

export function assertBulkyCategory(str: string): str is Category {
	return (
		str === 'ESSENCE' ||
		str === 'SCARAB' ||
		str === 'DELIRIUM_ORB' ||
		str === 'MAP' ||
		str === 'MAP_8_MOD' ||
		str === 'BESTIARY' ||
		str === 'DELVE' ||
		str === 'CATALYST' ||
		str === 'CURRENCY' ||
		str === 'HEIST' ||
		str === 'EXPEDITION' ||
		str === 'FRAGMENT'
	)
}
