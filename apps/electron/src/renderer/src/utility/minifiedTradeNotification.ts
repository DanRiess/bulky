import { BulkyBazaarOffer, BulkyFilter, CATEGORY_IDX_TO_NAME, CATEGORY_NAME_TO_IDX, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from './factory'
import { BULKY_TRANSFORM } from './transformers'

/**
 * In the app, this abbreviates to B_MTN (Bulky_MinifiedTradeNotification).
 * It uses Bulky's name_to_idx functions to minify item names into a byte array.
 * The string has to start with the MTN version and the Separator %.
 * Then the blocks follow. They are b64 encoded arraybuffers.
 *
 * Bytes:
 * 0: Category (Uint8)
 * 1-2: Item type (Uint16)
 * 3: Item tier (Uint8)
 * 4-7: Quantity (Uint32)
 * 8-12: Price (Uint32)
 *
 * There can be multiple blocks like this. The separator is a colon.
 * If the offer has a regex to be transmitted, it will come after the blocks. The separator is %.
 *
 * Full string template: Version%block:block:...%Regex
 */
export function generateMinifiedTradeNotification(
	offer: BulkyBazaarOffer,
	filter: BulkyFilter,
	priceComputeFunction: ComputedBulkyOfferStore['calculateItemBasePrice']
) {
	const mtnVersion = import.meta.env.VITE_MTN_VERSION ?? '1'
	const categoryIdx = CATEGORY_NAME_TO_IDX[offer.category]
	const typeToIdxMap = BULKY_FACTORY.getNameToIdxTypeMap(offer.category)
	const tierToIdxMap = BULKY_FACTORY.getNameToIdxTierMap(offer.category)

	if (!typeToIdxMap || !tierToIdxMap) {
		throw new Error('No name to idx maps')
	}

	const b64ItemStrings = offer.items.map(item => {
		// Type and tier can just be looked up.
		const typeIdx = typeToIdxMap[item.type]
		const tierIdx = tierToIdxMap[item.tier]

		// Calculate the quantity.
		const filterField = filter.fields.find(field => field.type === item.type && field.tier === item.tier)
		const quantity = filter.alwaysMaxQuantity || filter.fullBuyout ? item.quantity : filterField?.quantity ?? 0

		// Use the provided function to calculate the item price.
		const price = priceComputeFunction(item, filter)

		// Create an arraybuffer and a dataview to set the properties.
		// Refer to the function description for how to set the bytes.
		const ab = new ArrayBuffer(12)
		const dv = new DataView(ab)

		dv.setUint8(0, categoryIdx)
		dv.setUint16(1, typeIdx)
		dv.setUint8(3, tierIdx)
		dv.setUint32(4, quantity)
		dv.setUint32(8, price)

		return btoa(String.fromCharCode(...new Uint8Array(ab)))
	})

	let minifiedTradeNotification = `${mtnVersion}:${b64ItemStrings.join(':')}`

	if (filter.regex) {
		minifiedTradeNotification += `%RX%${filter.regex}`
	}

	return minifiedTradeNotification
}

/**
 * Consumes a B_MTN b64 encoded string and decodes it.
 * The string has to start with the MTN version and the Separator %.
 *
 * After that
 * Then the blocks follow. They are b64 encoded arraybuffers.
 *
 * Bytes:
 * 0: Category (Uint8)
 * 1-2: Item type (Uint16)
 * 3: Item tier (Uint8)
 * 4-7: Quantity (Uint32)
 * 8-12: Price (Uint32)
 *
 * There can be multiple blocks like this. The separator is a colon.
 * If the offer has a regex to be transmitted, it will come after the blocks. The separator is %.
 *
 * Full string template: Version%block:block:...%Regex
 */
export function decodeMinifiedTradeNotification(mtn: string) {
	const [version, blockString, regex] = mtn.split('%')

	if (version !== import.meta.env.VITE_MTN_VERSION) {
		throw new Error('MTN Version not supported.')
	}

	// Get the nameToIdx maps here.

	let categoryIdx: number	= 0

	const trades = blockString.split(':').map((block, idx) => {
		try {
			// Convert the block to an arraybuffer and create a data view on it.
			const buffer = Uint8Array.from(atob(block), c => c.charCodeAt(0)).buffer
			const dv = new DataView(buffer)

			idx === 0 && (categoryIdx = dv.getUint8(0))
			const typeIdx = dv.getUint16(1)
			const tierIdx = dv.getUint8(3)
			const quantity = dv.getUint32(4)
			const price = dv.getUint32(8)

			return `${quantity} x ${}`
		} catch (e) {
			throw new Error('could not analyze block')
		}
	})

	const category = CATEGORY_IDX_TO_NAME[categoryIdx]
	const categoryAddendum = regex ? ' with Regex' : ' without Regex'
	const categoryDisplayValue = BULKY_TRANSFORM.stringToDisplayValue(category + categoryAddendum)
}

// TODO: change category to not appear in the blocks, but instead after the version as a number string (e. g. '4').
// Has to be done to be able to get the category and therefore the name_to_idx maps before decoding the trades.