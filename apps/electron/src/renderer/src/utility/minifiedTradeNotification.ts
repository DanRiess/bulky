import {
	BulkyBazaarItem,
	BulkyFilter,
	Category,
	CATEGORY_IDX_TO_NAME,
	CATEGORY_NAME_TO_IDX,
	ComputedBulkyOfferStore,
} from '@shared/types/bulky.types'
import { BULKY_FACTORY } from './factory'
import { BULKY_TRANSFORM } from './transformers'
import { DecodedMTN } from '@shared/types/general.types'
import { MaybeComputedRef } from '@shared/types/utility.types'
import { toValue } from 'vue'
import { notEmpty } from './notEmpty'
import { BULKY_MAPS } from '@web/categories/map/map.transformers'

/**
 * Generate a minified trade notification (MTN).
 * This works by converting all item names to numbers (using name_to_idx maps) and saving them as b64 encoded byte arrays.
 *
 * The finished MTN is a string consisting of four parts separated by a % character as follows:
 * 'MTNVersion' % 'Category Idx as string' % 'itemblock : itemblock : ...' % 'Regex'
 *
 * - The 'regex' part is optional
 * - The item blocks are byte arrays encoded as b64 strings.
 *
 * Bytes:
 * 0-1: Item type (Uint16)
 * 2: Secondary type option (Uint8, either 0 or 1)
 * 3: Item tier (Uint8)
 * 4-7: Quantity (Uint32)
 * 8-12: Price (Uint32)
 *
 * There can be multiple blocks like this. The separator is a colon.
 * If the offer has a regex to be transmitted, it will come after the blocks. The separator is %.
 */
export function generateMinifiedTradeNotification(
	// offer: BulkyBazaarOffer,
	category: Category,
	items: MaybeComputedRef<BulkyBazaarItem[]>,
	fullPrice: number,
	filter: BulkyFilter,
	priceComputeFunction: ComputedBulkyOfferStore['calculateBaseItemPrice']
) {
	const mtnVersion = import.meta.env.VITE_MTN_VERSION ?? '1'
	const categoryIdx = CATEGORY_NAME_TO_IDX[category]
	const secondaryTypeOption = category === 'FRAGMENT' && filter.fullSets
	const typeToIdxMap = BULKY_FACTORY.getNameToIdxTypeMap(category, secondaryTypeOption)
	const tierToIdxMap = BULKY_FACTORY.getNameToIdxTierMap(category)

	if (!typeToIdxMap || !tierToIdxMap) {
		throw new Error('No name to idx maps')
	}

	const b64ItemStrings = filter.fullBuyout
		? // Handle full buyout case. Set every value except price to max.
		  [0].map(() => {
				const ab = new ArrayBuffer(12)
				const dv = new DataView(ab)

				dv.setUint16(0, 0xff)
				dv.setUint8(2, 0xf)
				dv.setUint8(3, 0xf)
				dv.setUint32(4, 0xffff)
				dv.setFloat32(8, toValue(fullPrice))

				return btoa(String.fromCharCode(...new Uint8Array(ab)))
		  })
		: // Buyout case for individual items.
		  toValue(items)
				.map(item => {
					let adjustedItem = item

					if (item.category === 'MAP_8_MOD') {
						const perItemAttributes = BULKY_MAPS.filterIndividual8ModItemsBySubtype(item, filter)
						if (perItemAttributes) {
							adjustedItem = {
								...item,
								perItemAttributes,
							}
						}
					}

					// Type and tier can just be looked up.
					const typeIdx = typeToIdxMap[item.type]
					const tierIdx = tierToIdxMap[item.tier]
					const secondaryTypeOption = category === 'FRAGMENT' && filter.fullSets

					// Calculate the quantity.
					const filterField = filter.fields.find(
						field => field.type === adjustedItem.type && field.tier === adjustedItem.tier
					)
					const quantity =
						filter.alwaysMaxQuantity || filter.fullBuyout ? adjustedItem.computedQuantity : filterField?.quantity ?? 0

					// Use the provided function to calculate the adjustedItem price.
					let price: number
					try {
						price = priceComputeFunction(adjustedItem, filter)
					} catch (e) {
						return undefined
					}

					// Create an arraybuffer and a dataview to set the properties.
					// Refer to the function description for how to set the bytes.
					const ab = new ArrayBuffer(12)
					const dv = new DataView(ab)

					dv.setUint16(0, typeIdx)
					dv.setUint8(2, secondaryTypeOption ? 1 : 0)
					dv.setUint8(3, tierIdx)
					dv.setUint32(4, quantity)
					dv.setFloat32(8, price)

					return btoa(String.fromCharCode(...new Uint8Array(ab)))
				})
				.filter(notEmpty)

	let minifiedTradeNotification = `${mtnVersion}%${categoryIdx}%${b64ItemStrings.join(':')}`

	if (filter.regex) {
		minifiedTradeNotification += `%${filter.regex}`
	}

	return minifiedTradeNotification
}

/**
 * Consumes a B_MTN b64 encoded string and decodes it.
 * The string consists of four parts separated by a % character as follows:
 * 'MTNVersion' % 'Category Idx as string' % 'itemblock : itemblock : ...' % 'Regex'
 *
 * - The 'regex' part is optional
 * - The item blocks are byte arrays encoded as b64 strings.
 *
 * Bytes:
 * 0-1: Item type (Uint16)
 * 2-3: Item tier (Uint16)
 * 4-7: Quantity (Uint32)
 * 8-12: Price (Uint32)
 *
 * There can be multiple blocks like this. The separator is a colon.
 * If the offer has a regex to be transmitted, it will come after the blocks. The separator is %.
 */
export function decodeMinifiedTradeNotification(mtn: string): DecodedMTN {
	const [version, categoryIdxString, blockString, regex] = mtn.split('%')

	if (version !== import.meta.env.VITE_MTN_VERSION) {
		throw new Error('MTN Version not supported.')
	}

	if (!categoryIdxString || typeof parseInt(categoryIdxString) !== 'number' || !blockString) {
		throw new Error('Malformed MTN String')
	}

	const categoryIdx = parseInt(categoryIdxString)
	const category = CATEGORY_IDX_TO_NAME[categoryIdx]
	const categoryAddendum = regex ? ' with Regex' : ''
	const categoryDisplayValue = BULKY_TRANSFORM.stringToDisplayValue(category + categoryAddendum)

	// Get the nameToIdx maps here.
	// const idxToTypeMap = BULKY_FACTORY.getIdxToNameTypeMap(category)
	const idxToTierMap = BULKY_FACTORY.getIdxToNameTierMap(category)

	if (!idxToTierMap) {
		throw new Error('No idx to name maps')
	}

	let fullPrice = 0

	const trades = blockString.split(':').map(block => {
		try {
			// Convert the block to an arraybuffer and create a data view on it.
			const buffer = Uint8Array.from(atob(block), c => c.charCodeAt(0)).buffer
			const dv = new DataView(buffer)

			const typeIdx = dv.getUint16(0)
			const secondaryTypeOption = !!dv.getUint8(2)
			const tierIdx = dv.getUint8(3)
			const quantity = dv.getUint32(4)
			const price = dv.getFloat32(8)

			// Also calculate the full price for later.
			// In case the full offer is requested, every value except price will be max.
			if (typeIdx === 0xff && tierIdx === 0xf && quantity === 0xffff) {
				console.log('full')
				fullPrice += price
				return 'Full Offer'
			} else {
				fullPrice += price * quantity
				const idxToTypeMap = BULKY_FACTORY.getIdxToNameTypeMap(category, secondaryTypeOption)

				if (!idxToTypeMap) {
					throw new Error('No idx to name maps')
				}

				const item = {
					type: idxToTypeMap[typeIdx],
					tier: idxToTierMap[tierIdx],
					quantity,
					price,
				}
				return `${quantity} x ${BULKY_FACTORY.getNameFromTypeAndTier(category, item)} for ${
					Math.round(price * quantity * 10) / 10
				}c`
			}
		} catch (e) {
			throw new Error('could not analyze block')
		}
	})

	return {
		category: categoryDisplayValue,
		trades,
		fullPrice,
		regex,
	}
}
