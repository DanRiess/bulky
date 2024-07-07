// import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
// import { encodeArrayBufferToUrlSafeBase64 } from './arrayBufferBase64'
// import { getEntries } from '@shared/types/utility.types'

// /**
//  * Proof of concept to convert a json offer into binary.
//  * Replace later.
//  */
// export function makeBinTestData() {
// 	const compassListingStore = useEssenceOfferStore()
// 	let ab: ArrayBuffer

// 	compassListingStore.offers.forEach(listing => {
// 		console.log(listing)
// 		const items = getEntries(listing.items)
// 		// this will be wrong because tiers are nested
// 		const itemLength = items.length
// 		ab = new ArrayBuffer(11 + itemLength * 8)
// 		const dv = new DataView(ab)

// 		// "BCF "
// 		dv.setUint8(0, 66)
// 		dv.setUint8(1, 67)
// 		dv.setUint8(2, 70)
// 		dv.setUint8(3, 32)

// 		// Version
// 		dv.setUint8(4, 1)

// 		// item length
// 		dv.setUint16(5, itemLength, true)

// 		// data identifier
// 		dv.setUint8(7, 68)
// 		dv.setUint8(8, 65)
// 		dv.setUint8(9, 84)
// 		dv.setUint8(10, 65)

// 		let offset = 11

// 		items.forEach(item => {
// 			console.log({ item })
// 			if (!item || !item[1] || !item[0]) return
// 			const name = item[0]
// 			const typeArray = item[1]
// 			typeArray.forEach(nestedItem => {
// 				const nameIdx = SEXTANT_MODIFIER_NAME_TO_IDX[name]
// 				const tierIdx = SEXTANT_TIER_NAME_TO_IDX[nestedItem.tier]

// 				dv.setUint8(offset, nameIdx)
// 				dv.setUint8(offset + 1, tierIdx)
// 				dv.setUint16(offset + 2, nestedItem.quantity, true)
// 				dv.setUint16(offset + 4, nestedItem.price, true)
// 				dv.setUint8(offset + 6, 66)
// 				dv.setUint8(offset + 7, 82)

// 				offset += 8
// 			})
// 		})
// 		console.log(ab)

// 		const b64 = encodeArrayBufferToUrlSafeBase64(ab)
// 		console.log({ b64 })
// 	})

// 	// function base64ToArrayBuffer(base64) {
// 	// 	var binaryString = atob(base64)
// 	// 	var bytes = new Uint8Array(binaryString.length)
// 	// 	for (var i = 0; i < binaryString.length; i++) {
// 	// 		bytes[i] = binaryString.charCodeAt(i)
// 	// 	}
// 	// 	return bytes.buffer
// 	// }

// 	// console.log(base64ToArrayBuffer(b64))
// }
