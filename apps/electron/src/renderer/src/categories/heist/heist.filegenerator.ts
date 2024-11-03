/**
 * This script can generate the heist.const.ts file.
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

	const heistSection = data.result.find(section => section.id === 'Heist')

	if (!heistSection) return []

	const contracts = heistSection.entries
		.filter(item => item.id.includes('contract-top'))
		.map(item => item.text.split(' Contract')[0].toUpperCase().replace(new RegExp(' ', 'g'), '_'))
		.sort()

	const blueprints = ['BLUEPRINT', 'BLUEPRINT_3_WINGS', 'BLUEPRINT_4_WINGS']

	return ["ROGUE'S_MARKER", ...blueprints, ...contracts]
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the currency.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Heist Types
	const types = `export const HEIST_TYPE = {\n${items.map(item => `"${item}": "${item}",`).join('\n')}\n} as const`
	const typeIdxToName = 'export const HEIST_TYPE_IDX_TO_NAME = getKeys(HEIST_TYPE)'
	const typeNameToIdx =
		'export const HEIST_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(HEIST_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Heist Tiers
	const tiers = `export const HEIST_TIER = {\n"ILVL_68-72": "ILVL_68-72",\n"ILVL_73-77": "ILVL_73-77",\n"ILVL_78-82": "ILVL_78-82",\n"ILVL_83+": "ILVL_83+",\n} as const`
	const tierIdxToName = 'export const HEIST_TIER_IDX_TO_NAME = getKeys(HEIST_TIER)'
	const tierNameToIdx =
		'export const HEIST_TIER_NAME_TO_IDX = typedFromEntries(Object.entries(HEIST_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx} \n\n ${tiers} \n\n ${tierIdxToName} \n\n ${tierNameToIdx}`

	console.log('Writing to file heist.const.ts')
	writeFileSync('./heist.const.ts', fullFile)
	console.log('Written file successfully. Check and format it.')
})
