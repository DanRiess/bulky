/**
 * This script can generate the scarab.const.ts file.
 * It grabs metadata from poedb.tw and generates the file from it.
 *
 * Technically, it could also generate the transformer and type files,
 * but that was more work than doing it manually. The const file is also the only
 * one that might need to be updated in the future.
 */
import { writeFileSync } from 'node:fs'

async function getPoeDbItemData() {
	const response = await fetch('https://pathofexile.com/api/trade/data/static')
	const data = (await response.json()) as {
		result: {
			id: string
			label: string
			entries: { id: string; text: string; image: string }[]
		}[]
	}

	// The fragment section contains the scarabs.
	const fragmentCategory = data.result.find(section => section.id === 'Fragments')
	const allflameCategory = data.result.find(section => section.id === 'AllflameEmbers')

	const fragments =
		fragmentCategory?.entries
			.filter(item => item.id.includes('scarab'))
			.map(item => item.text.toUpperCase().replace(new RegExp(' ', 'g'), '_'))
			.filter(Boolean) ?? []

	const allflames =
		allflameCategory?.entries
			.filter(item => item.id.includes('allflame'))
			.map(item => item.text.toUpperCase().replace(new RegExp(' ', 'g'), '_'))
			.filter(Boolean) ?? []

	// Return all scarabs
	return [...fragments, ...allflames].sort()
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the currency.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Scarab Types
	const comment = `// DO NOT CHANGE THE ORDER\n// Found ${items.length} scarabs.`
	const types = `export const SCARAB_TYPE = {\n${items.map(item => `"${item}": "${item}",`).join('\n')}\n} as const`
	const typeIdxToName = 'export const SCARAB_TYPE_IDX_TO_NAME = getKeys(SCARAB_TYPE)'
	const typeNameToIdx =
		'export const SCARAB_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(SCARAB_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${comment} \n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx}`

	console.log('Writing to file scarab.const.ts')
	writeFileSync('./scarabtest.const.ts', fullFile)
	console.log('Written file successfully. Check and format it.')
})
