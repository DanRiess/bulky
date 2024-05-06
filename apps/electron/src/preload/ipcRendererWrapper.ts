/**
 * Taken from https://gist.github.com/mandemeskel/604b53caf8d17cba8edf869d29a07df0
 * Original Author: mandemeskel
 * Slightly enhanced by DanRiess
 *
 * This exists because `ipcMain.handle` does not allow
 * you to return rejected Promises with custom data.
 * You can throw an error in `handle` but it can only
 * be a string or existing error object. This means all
 * the error processing logic must live in main process
 * in order to figure what string or error type to throw
 * in `handle`.
 *
 * This abstract allows us to send messages to `handle`.
 * If `handle` resolves to message with `rejected` equal
 * to true then this method throws an error with the object
 * that is cotained in the resolved promise. Everything else
 * is the same.
 *
 * This allows us to get custom error objects and use catch
 * in `ipc.invoke` calls. It also frees us to remove all the
 * error catching from `then` - since all failures will be
 * caught in ipcMain and rethrown here.
 *
 * https://github.com/electron/electron/issues/24427
 * https://github.com/electron/electron/issues/25196
 */
import { SerializedError } from '@shared/errors/serializedError'
import { ipcRenderer } from 'electron'

async function invoke(channel: string, args?: any) {
	try {
		const response = await ipcRenderer.invoke(channel, args)

		if (response instanceof SerializedError) {
			throw response
		} else {
			return response
		}
	} catch (error: unknown) {
		console.log(error)
		console.warn('[IpcRendererService.invoke] threw an error or promise was rejected', { error })
		return new Promise((_, reject) => reject(error))
	}
}

export default {
	invoke,
}
