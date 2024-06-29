/**
 * This script can generate the map.const.ts file.
 * It grabs metadata from poedb.tw and generates the file from it.
 */

const fs = require('node:fs')

async function getPoeDbItemData() {
	const response = await fetch(
		`https://poedb.tw/json/autocomplete_us.json?${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
	)
	const data = (await response.json()) as { label: string; value: string; desc: string; class: string }[]

	const maps = data.filter(item => item.desc === 'Maps')

	return maps.map(item => item.value.replace(/_map/i, '').toUpperCase())
}

getPoeDbItemData().then(maps => {
	console.log('Generate the file content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Map Types
	const mapTypes = `export const MAP_TYPE = {\n${maps.map(m => `${m}: '${m}',`).join('\n')}\n} as const`
	const mapTypeIdxToName = 'export const MAP_TYPE_IDX_TO_NAME = getKeys(MAP_TYPE)'
	const mapTypeNameToIdx =
		'export const MAP_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(MAP_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Map Tiers
	const mapTiers = `export const MAP_TIER = {\n${new Array(17)
		.fill(0)
		.map((_, idx) => `TIER_${idx + 1}: 'TIER_${idx + 1}',`)
		.join('\n')}\n} as const`
	const mapTierIdxToName = 'export const MAP_TIER_IDX_TO_NAME = getKeys(MAP_TIER)'
	const mapTierNameToIdx =
		'export const MAP_TIER_NAME_TO_IDX = typedFromEntries(Object.entries(MAP_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${mapTypes} \n\n ${mapTypeIdxToName} \n\n ${mapTypeNameToIdx} \n\n ${mapTiers} \n\n ${mapTierIdxToName} \n\n ${mapTierNameToIdx}`

	console.log('Writing to file map.const.ts')
	fs.writeFile('./map.const.ts', fullFile, err => {
		if (err) {
			console.log(err)
			return
		}

		console.log('Written file successfully. Please check, format and save it.')
	})

	// require('child_process').spawn('clip').stdin.end(maps.join('\n'))
})
