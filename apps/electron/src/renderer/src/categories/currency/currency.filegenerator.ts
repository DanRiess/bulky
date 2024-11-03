/**
 * This script can generate the currency.const.ts file.
 * It grabs metadata from the static pathofexile trade api and generates the file from it.
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

	const currency = data.result.find(section => section.id === 'Currency')

	if (!currency) return []

	return currency.entries
		.map(item => item.text.toUpperCase().replace(new RegExp(' ', 'g'), '_'))
		.filter(val => val && !val.match(/rogue.*marker/i)) // rogue markers will be in heist category.
		.sort()
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the currency.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Currency Types
	const types = `export const CURRENCY_TYPE = {\n${items.map(item => `"${item}": "${item}",`).join('\n')}\n} as const`
	const typeIdxToName = 'export const CURRENCY_TYPE_IDX_TO_NAME = getKeys(CURRENCY_TYPE)'
	const typeNameToIdx =
		'export const CURRENCY_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(CURRENCY_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx}`

	console.log('Writing to file currency.const.ts')
	writeFileSync('./currency.const.ts', fullFile)
	console.log('Written file successfully. Check and format it.')
})
