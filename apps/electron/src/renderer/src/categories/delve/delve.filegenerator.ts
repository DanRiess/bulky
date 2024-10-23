/**
 * This script can generate the map.const.ts file.
 * It grabs metadata from poedb.tw and generates the file from it.
 */

// import { capitalize } from 'lodash'

const fs = require('node:fs')

async function getPoeDbItemData() {
	const response = await fetch(
		`https://poedb.tw/json/autocomplete_us.json?${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
	)
	const data = (await response.json()) as { label: string; value: string; desc: string; class: string }[]

	const fossils = data.filter(item => item.value.match(/_Fossil$/g) && item.desc === 'Stackable Currency')
	const resonators = data.filter(
		item => item.desc === 'Delve Stackable Socketable Currency' && !item.value.includes('Alchemical')
	)

	// return maps.map(item => item.value.replace(/_map/i, '').toUpperCase())
	return [...fossils.map(fossil => fossil.value.toUpperCase()), ...resonators.map(resonator => resonator.value.toUpperCase())]
}

getPoeDbItemData().then(items => {
	console.log({ items })
	// DELVE.CONST.TS
	console.log('Generate the delve.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Delve Types
	const types = `export const DELVE_TYPE = {\n${items.map(m => `${m}: '${m}',`).join('\n')}\n} as const`
	const typeIdxToName = 'export const DELVE_TYPE_IDX_TO_NAME = getKeys(DELVE_TYPE)'
	const typeNameToIdx =
		'export const DELVE_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(DELVE_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Delve Tiers
	// const tiers = `export const DELVE_TIER = {\n${new Array(17)
	// 	.fill(0)
	// 	.map((_, idx) => `TIER_${idx + 1}: 'TIER_${idx + 1}',`)
	// 	.join('\n')}\n} as const`
	// const tierIdxToName = 'export const DELVE_TIER_IDX_TO_NAME = getKeys(DELVE_TIER)'
	// const tierNameToIdx =
	// 	'export const DELVE_TIER_NAME_TO_IDX = typedFromEntries(Object.entries(DELVE_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx}`

	console.log('Writing to file map.const.ts')
	fs.writeFile('./delve.const.ts', fullFile, err => {
		if (err) {
			console.log(err)
			return
		}

		console.log('Written file successfully. Please check, format and save it.')
	})
	return

	// // MAP.TRANSFORMERS.TS
	// console.log('Generating map.transformers.ts')

	// // Imports
	// const importsTransformers = `import { BulkyItemOverrideRecord } from '@shared/types/bulky.types'
	// 	import { MapTier, MapType, ShopMap } from './map.types'
	// 	import { NinjaPriceRecord } from '@shared/types/ninja.types'
	// 	import { Ref, computed } from 'vue'
	// 	import { PoeMapStack } from '@shared/types/poe.types'
	// 	import { useConfigStore } from '@web/stores/configStore'
	// 	import { capitalize } from 'lodash'
	// 	import { MAP_TIER, MAP_TYPE } from './map.const'`

	// // Exports
	// const exports = `export const BULKY_MAPS = {
	// 	generateTypeFromBaseType,
	// 	generateTierFromBaseTier,
	// 	generateMapFromPoeMapStack,
	// 	generateMapNameFromType,
	// }`

	// // generateTypFromBaseType
	// const generateTypeFromBaseType = `function generateTypeFromBaseType(baseType: string): MapType | undefined {
	// 	${maps
	// 		.map(
	// 			(m, idx) =>
	// 				`${idx ? 'else if' : 'if'} (baseType === "${
	// 					m
	// 						.split('_')
	// 						.map(t => capitalize(t))
	// 						.join(' ') + ' Map'
	// 				}") return MAP_TYPE.${m}\n`
	// 		)
	// 		.join(' ')}
	// }`

	// // generateTierFromBaseType
	// const generateTierFromBaseTier = `
	// function generateTierFromBaseTier(tier: number): MapTier | undefined {
	// 	return MAP_TIER['TIER' + tier]
	// }`

	// const generateMapNameFromType = `
	// function generateMapNameFromType(type: MapType) {
	// 	return type
	// 		.split('_')
	// 		.map(t => capitalize(t))
	// 		.join(' ') + ' Map'
	// }`

	// const generateMapFromPoeMapStack = `
	// function generateMapFromPoeMapStack(
	// 	poeMapStack: PoeMapStack,
	// 	prices: Ref<NinjaPriceRecord>,
	// 	priceOverrides: Ref<BulkyItemOverrideRecord>
	// ): ShopMap | undefined {
	// 	const configStore = useConfigStore()

	// 	const type = generateTypeFromBaseType(poeMapStack.metadata.map.name)
	// 	const tier = generateTierFromBaseTier(poeMapStack.metadata.map.tier)

	// 	if (!type || !tier || !poeMapStack.metadata.items) return

	// 	const map = poeMapStack.metadata.map

	// 	return {
	// 		type,
	// 		tier,
	// 		name: map.name,
	// 		icon: map.image,
	// 		quantity: poeMapStack.metadata.items,
	// 		price: computed(() => {
	// 			return Math.round((prices.value.get(\`\${type}_\${tier}\`)?.chaos ?? 0) * 10) / 10
	// 		}),
	// 		league: configStore.config.league,
	// 		category: 'MAP',
	// 		priceOverride: computed(() => {
	// 			return Math.round((priceOverrides.value.get(\`\${type}_\${tier}\`)?.priceOverride ?? 0) * 10) / 10
	// 		}),
	// 		selected: computed(() => {
	// 			return priceOverrides.value.get(\`\${type}_\${tier}\`)?.selected ?? true
	// 		})
	// 	}
	// }
	// `

	// // Combine the parts into the full file
	// const mapTransformers = `${importsTransformers} \n\n ${exports} \n\n ${generateTypeFromBaseType} \n\n ${generateTierFromBaseTier} \n\n ${generateMapFromPoeMapStack} \n\n ${generateMapNameFromType}`

	// console.log('Writing to file map.transformers.ts')
	// fs.writeFile('./map.transformers.ts', mapTransformers, err => {
	// 	if (err) {
	// 		console.log(err)
	// 		return
	// 	}

	// 	console.log('Written file successfully. Please check, format and save it.')
	// })

	// require('child_process').spawn('clip').stdin.end(maps.join('\n'))
})

export default {}
