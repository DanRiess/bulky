import { App } from 'electron'
import { readFile, writeFile } from 'fs'
import { BulkyConfig } from '@shared/types/config.types'

export function writeConfig(app: App, config: BulkyConfig) {
	console.log(app.getPath('userData'))
	console.log(config)

	const path = app.getPath('userData')
	writeFile(`${path}/config.json`, JSON.stringify(config), err => {
		if (!err) {
			console.log('Wrote Config Successfully')
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
