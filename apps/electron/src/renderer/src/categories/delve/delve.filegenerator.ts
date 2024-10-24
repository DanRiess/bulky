/**
 * This script can generate the delve.const.ts file.
 * It grabs metadata from poedb.tw and generates the file from it.
 * Consider using pathofexile.com/api/trade/data/static instead if necessary.
 *
 * Technically, it could also generate the transformer and type files,
 * but that was more work than doing it manually. The const file is also the only
 * one that might need to be updated in the future.
 */

import { writeFileSync } from 'node:fs'

async function getPoeDbItemData() {
	const response = await fetch(
		`https://poedb.tw/json/autocomplete_us.json?${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
	)
	const data = (await response.json()) as { label: string; value: string; desc: string; class: string }[]

	const fossils = data.filter(item => item.value.match(/_Fossil$/g) && item.desc === 'Stackable Currency').sort()
	const resonators = data
		.filter(item => item.desc === 'Delve Stackable Socketable Currency' && !item.value.includes('Alchemical'))
		.sort()

	return [...fossils.map(fossil => fossil.value.toUpperCase()), ...resonators.map(resonator => resonator.value.toUpperCase())]
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the delve.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Delve Types
	const types = `export const DELVE_TYPE = {\n${items.map(item => `"${item}": "${item}",`).join('\n')}\n} as const`
	const typeIdxToName = 'export const DELVE_TYPE_IDX_TO_NAME = getKeys(DELVE_TYPE)'
	const typeNameToIdx =
		'export const DELVE_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(DELVE_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx}`

	console.log('Writing to file delve.const.ts')
	writeFileSync('./delve.const.ts', fullFile)
	console.log('Written file successfully. Please check, format and save it.')
})
