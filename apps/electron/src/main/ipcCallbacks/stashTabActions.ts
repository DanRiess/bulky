import { PoeStashTab } from '@shared/types/stash.types'
import { App } from 'electron'
import { readFile, writeFile } from 'fs'

export async function readStashTabs(app: App) {
	const path = app.getPath('userData')

	return new Promise((resolve: (v: PoeStashTab[]) => void, reject) => {
		readFile(`${path}/stashTabs.json`, 'utf-8', (err, data) => {
			if (err) {
				reject('error reading file.')
			}

			try {
				const json = JSON.parse(data) as PoeStashTab[]
				resolve(json)
			} catch (e) {
				reject('invalid json')
			}
		})
	})
}

export function writeStashTabs(app: App, stashTabs: PoeStashTab[]) {
	console.log(app.getPath('userData'))
	console.log(stashTabs)

	const path = app.getPath('userData')
	writeFile(`${path}/stashTabs.json`, JSON.stringify(stashTabs), err => {
		if (!err) {
			console.log('Wrote stash tabs Successfully')
		} else {
			console.log(err)
			console.log('Error Writing stash tabs')
		}
	})
}
