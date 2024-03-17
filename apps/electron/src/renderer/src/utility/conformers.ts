import { AnyListingItems, ItemTier, ItemType, ListingItems } from '@web/types/bulky.types'
import { decodeUrlSafeBase64ToArrayBuffer } from './arrayBufferBase64'

/**
 * Transform items of one listing to Bulky standard object type.
 *
 * Performance: ~0.02 ms per listing with 20 items
 */
// export function conformListingItems<T extends ItemTier>(
// 	items: GenericListingItemDto[],
// 	conformItemKey: (arg: string) => ItemType,
// 	conformItemValue: (arg: GenericListingItemDto) => T | null
// ) {
// 	const conformedItems = items.reduce((prev, curr) => {
// 		const key = conformItemKey(curr.name)
// 		if (key === 'UNSUPPORTED') return prev

// 		if (!prev[key]) {
// 			prev[key] = []
// 		}

// 		const value = conformItemValue(curr)
// 		if (!value) return prev

// 		prev[key]?.push(value)
// 		return prev
// 	}, {} as PartialRecord<ItemType, GenericItemData<T>[]>)

// 	return conformedItems
// }

/**
 * Transform a binary listing into the Bulky standard object type
 * Performance: ~0.1 - 0.2 ms per listing with 20 items
 */
export function conformBinaryListingItems<T extends ListingItems>(
	items: string,
	idxToTypeMapper: Record<number, ItemType>,
	idxToTierMapper: Record<number, ItemTier>
): T | undefined {
	const t0 = performance.now()
	const itemBuffer = decodeUrlSafeBase64ToArrayBuffer(items)
	const dv = new DataView(itemBuffer)

	// must return 541475650, which is the uint32 representation of the "66 67 70 32" identifier sequence
	const identifier = dv.getUint32(0, true)
	if (identifier !== 541475650) {
		console.log('illegal identifier!')
		return
	}
	const version = dv.getUint8(4)
	if (version !== 1) {
		console.log('unsupported version')
		return
	}

	const itemLength = dv.getUint16(5, true)

	// must return 1096040772, which is the uint32 representation of the "68 65 84 65" data identifier sequence
	const dataIdentifier = dv.getUint32(7, true)
	if (dataIdentifier !== 1096040772) {
		console.log('illegal data identifier!')
		return
	}

	const conformedItems: AnyListingItems = {}

	// byte offset until now. It has to be always 11 at this point.
	let offset = 11
	for (let i = 0; i < itemLength; ++i) {
		const typeIdx = dv.getUint8(offset)
		const tierIdx = dv.getUint8(offset + 1)
		const quantity = dv.getUint16(offset + 2, true)
		const price = dv.getUint16(offset + 4, true)

		// must return 21058, which is the uint16 representation of the "66 82" item break sequence
		const itemBreak = dv.getUint16(offset + 6, true)

		if (itemBreak !== 21058) {
			// Try to find the break one byte before and after.
			// If it can be found, consider the current item to be broken, adjust the offset and continue.
			// If not, assume the byte array is broken from this point and break out of the loop.
			if (dv.getUint16(offset + 5, true) === 21058) {
				offset += 7
				continue
			} else if (offset + 7 < itemBuffer.byteLength && dv.getUint16(offset + 7, true) === 21058) {
				offset += 9
				continue
			} else {
				break
			}
		}

		const type = idxToTypeMapper[typeIdx]
		const tier = idxToTierMapper[tierIdx]

		if (type === 'UNSUPPORTED') continue

		if (!conformedItems[type]) {
			conformedItems[type] = []
		}

		conformedItems[type]?.push({
			tier,
			quantity,
			price,
		})

		offset += 8
	}
	console.log(`Performance: ${performance.now() - t0}`)

	// @ts-ignore
	return conformedItems
}
