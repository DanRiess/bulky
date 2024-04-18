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

	constructor(e: unknown) {
		const error =
			e instanceof Error ? { ...e } : typeof e === 'string' ? { ...new Error(e) } : { ...new Error('Unknown Error') }
		delete error.stack

		this.error = error
		this.handleAsRejectedPromise = true
	}
}
