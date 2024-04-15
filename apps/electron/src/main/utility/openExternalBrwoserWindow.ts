import { shell } from 'electron'

export function openExternalBrowserWindow(link: string) {
	return shell.openExternal(link)
}
