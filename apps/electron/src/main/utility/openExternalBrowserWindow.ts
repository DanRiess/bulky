import { shell } from 'electron'

export function openExternalBrowserWindow(url: string) {
	return shell.openExternal(url)
}
