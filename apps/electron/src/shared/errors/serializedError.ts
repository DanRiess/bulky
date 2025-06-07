import { SerializedErrorObject } from '@shared/types/error.types'
import { AxiosError } from 'axios'
import { BulkyError } from './bulkyError'

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
		// Trying to check this via e instanceof AxiosError will result in preload script not being able to load.
		if (e && typeof e === 'object' && 'isAxiosError' in e) {
			const axiosError = e as AxiosError
			const errorData = axiosError.response?.data

			let message: string
			if (errorData && typeof errorData === 'object' && 'error_description' in errorData) {
				message = errorData.error_description as string
			} else if (typeof errorData === 'string') {
				message = errorData
			} else {
				message = axiosError.message
			}

			let code: string | undefined
			if (errorData && typeof errorData === 'object' && 'error' in errorData) {
				code = errorData.error as string
			} else {
				code = axiosError.code
			}

			this.error = {
				name: axiosError.name,
				message,
				code,
				status: axiosError.status,
			}
		} else if (e instanceof BulkyError) {
			this.error = { ...e }
		} else if (typeof e === 'string') {
			this.error = {
				name: 'Error',
				message: e,
			}
		} else {
			this.error = {
				name: 'UnknownError',
				message: 'Unknown Error',
			}
		}

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
