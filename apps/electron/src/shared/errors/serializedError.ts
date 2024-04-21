import { SerializedErrorObject } from '@shared/types/error.types'

/**
 * Serialize an error into a plain js object.
 *
 * 'ipcMain.handle' doesn't allow throwing errors other than a basic Error
 * object to the context bridge.
 *
 * This serializer will transform them to an object that the
 * context bridge can handle, which will return this transformed
 * error to the renderer where it will be transformed into the originally
 * thrown error object again.
 */
export class SerializedError {
	error: SerializedErrorObject
	handleAsRejectedPromise: boolean

	constructor(e?: unknown) {
		const error =
			e instanceof Error ? { ...e } : typeof e === 'string' ? { ...new Error(e) } : { ...new Error('Unknown Error') }
		delete error.stack

		this.error = error
		this.handleAsRejectedPromise = true
	}

	// Custom 'instanceof' checker.
	// Objects lose their prototype when passing the context bridge.
	// Without this function, a serializedError created in nodejs will return false
	// if it is checked in the renderer.
	static [Symbol.hasInstance](obj: any) {
		if (!obj) return false
		const error = obj.error
		const handle = obj.handleAsRejectedPromise

		if (!error) return false

		return 'name' in error && 'message' in error && typeof handle === 'boolean'
	}

	// Can be used like this: Object.prototype.toString.call(obj).
	// If the object was instantiated using this class, will return [object SerializedError].
	// Does not work with objects that pass the context bridge.
	get [Symbol.toStringTag]() {
		return 'SerializedError'
	}
}
