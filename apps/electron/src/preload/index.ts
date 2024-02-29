import { contextBridge } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
import { api } from './api'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		// electronAPI is a cjs module and cannot be imported into preload.
		// https://www.electronjs.org/docs/latest/tutorial/sandbox
		// contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('api', api)
	} catch (error) {
		console.error(error)
	}
} else {
	// @ts-ignore (define in dts)
	// window.electron = electronAPI
	// @ts-ignore (define in dts)
	window.api = api
}
