import { App } from 'electron'
import { readFile, writeFile } from 'fs'
import { BulkyConfig } from '@shared/types/config.types'
import { AppStateStore } from '@main/stores/appStateStore'

export function writeConfig(app: App, config: BulkyConfig) {
	const path = app.getPath('userData')
	writeFile(`${path}/config.json`, JSON.stringify(config), err => {
		if (!err) {
			// Update the global app state.
			const appStateStore = AppStateStore.instance
			appStateStore.appToggleHotkey = config.hotkeySettings.keys.appToggle.keyCode
		} else {
			console.log(err)
			console.log('Error Writing Config')
		}
	})
}

export async function readConfig(app: App) {
	const path = app.getPath('userData')

	return new Promise((resolve: (v: BulkyConfig) => void, reject) => {
		readFile(`${path}/config.json`, 'utf-8', (err, data) => {
			if (err) {
				reject('error reading file.')
			}

			try {
				const json = JSON.parse(data) as BulkyConfig
				resolve(json)
			} catch (e) {
				reject('invalid json')
			}
		})
	})
}
