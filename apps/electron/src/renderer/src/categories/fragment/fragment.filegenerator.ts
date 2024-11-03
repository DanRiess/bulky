/**
 * This script can generate the fragment.const.ts file.
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

	const fragments = data.result.find(section => section.id === 'Fragments')

	if (!fragments) return []

	return fragments.entries
		.map(item => item.text.toUpperCase().replace(new RegExp(' ', 'g'), '_'))
		.filter(val => val && !val.match(/scarab|cre.*eldersl|key.*decay|key.*cruci|mad.*obje|mor.*set|sacr.*set/i))
		.sort()
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the fragment.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Fragment Types
	const types = `export const FRAGMENT_TYPE = {\n${items.map(item => `"${item}": "${item}",`).join('\n')}\n} as const`
	const typeIdxToName = 'export const FRAGMENT_TYPE_IDX_TO_NAME = getKeys(FRAGMENT_TYPE)'
	const typeNameToIdx =
		'export const FRAGMENT_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(FRAGMENT_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Sets (specific to fragments, this needs to be hardcoded).
	// const sets = `export const FRAGMENT_SET: Record<string, (keyof typeof FRAGMENT_TYPE)[]> = {
	const sets = `export const FRAGMENT_SET = {
		SIRUS: ["AL-HEZMIN'S_CREST", "DROX'S_CREST", "BARAN'S_CREST", "VERITANIA'S_CREST"],
		ADORNED: ['AMBITION', 'BEAUTY', 'COOPERATION', 'CURIOSITY'],
		ELDER: ['FRAGMENT_OF_CONSTRICTION', 'FRAGMENT_OF_ENSLAVEMENT', 'FRAGMENT_OF_ERADICATION', 'FRAGMENT_OF_PURIFICATION'],
		UBER_ELDER: ['FRAGMENT_OF_EMPTINESS', 'FRAGMENT_OF_KNOWLEDGE', 'FRAGMENT_OF_SHAPE', 'FRAGMENT_OF_TERROR'],
		SHAPER: ['FRAGMENT_OF_THE_CHIMERA', 'FRAGMENT_OF_THE_HYDRA', 'FRAGMENT_OF_THE_MINOTAUR', 'FRAGMENT_OF_THE_PHOENIX'],
		ATZIRI: ['SACRIFICE_AT_DAWN', 'SACRIFICE_AT_DUSK', 'SACRIFICE_AT_MIDNIGHT', 'SACRIFICE_AT_NOON'],
		UBER_ATZIRI: ['MORTAL_GRIEF', 'MORTAL_IGNORANCE', 'MORTAL_HOPE', 'MORTAL_RAGE'],
		LEGION: [
			'TIMELESS_ETERNAL_EMBLEM',
			'TIMELESS_KARUI_EMBLEM',
			'TIMELESS_MARAKETH_EMBLEM',
			'TIMELESS_TEMPLAR_EMBLEM',
			'TIMELESS_VAAL_EMBLEM',
		],
		UBER_LEGION: [
			'UNRELENTING_TIMELESS_ETERNAL_EMBLEM',
			'UNRELENTING_TIMELESS_KARUI_EMBLEM',
			'UNRELENTING_TIMELESS_MARAKETH_EMBLEM',
			'UNRELENTING_TIMELESS_TEMPLAR_EMBLEM',
			'UNRELENTING_TIMELESS_VAAL_EMBLEM',
		],
	} as const`

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx} \n\n ${sets}`

	console.log('Writing to file fragment.const.ts')
	writeFileSync('./fragment.const.ts', fullFile)
	console.log('Written file successfully. Check and format it.')
})
