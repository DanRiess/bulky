/**
 * Conform any received object into a form that this app can deal with by providing the respective conform functions.
 * Use these functions to transform objects from backend requests (DTOs).
 * The goal is to be able to change a dto later without affecting the entire app.
 */

import { getKeys } from '@web/types/utitlity.types'

/**
 * Consumes a listing payload and conforms its keys to Bulky standards.
 * E. g. for compasses: deliMirror becomes MIRROR_OF_DELIRIUM
 */
export function conformPayloadKeys<P extends object, F extends Function>(payload: P, conformFunction: F) {
	const keys = getKeys(payload)
	for (const key of keys) {
		const conformedKey = conformFunction(key)
		const descriptor = Object.getOwnPropertyDescriptor(payload, key)
		if (descriptor === undefined) continue

		Object.defineProperty(payload, conformedKey, descriptor)
		delete payload[key]
	}
	return payload
}

/** Removes the unsupported property from a payload */
export function removeUnsupportedProperty<P extends object>(payload: P): Omit<P, 'UNSUPPORTED'> {
	delete payload['UNSUPPORTED']
	return payload
}

/**
 * Consumes a payload object and validate if all of its values conform to Bulky standards.
 * If not, deletes the respective key.
 */
export function validatePayloadValues<P extends object, F extends Function>(payload: P, assertor: F): P {
	const entries = Object.entries(payload)
	for (const [key, value] of entries) {
		// value is not an array. use standard assertion workflow
		if (!Array.isArray(value)) {
			!assertor(value) && delete payload[key]
		}
		// value is an array. check every single item and only remove the illegal ones
		else {
			// grab indices that fail the assertions
			const indicesToDelete = value
				.map((v, idx) => {
					if (!assertor(v)) return idx
					return undefined
				})
				.filter(v => v !== undefined) as number[]

			// reverse the indices
			indicesToDelete.reverse()

			// remove the failed entries one by one
			indicesToDelete.forEach(i => value.splice(i, 1))

			// if the array is empty, remove the entire key
			if (value.length === 0) delete payload[key]
		}
	}
	return payload
}
