import {
	BulkyNinjaPriceBlock,
	BulkyNinjaPriceItem,
	CurrentNinjaPrices,
	PoeNinjaCategory,
	PoeNinjaCurrencyLine,
	PoeNinjaItemLine,
} from '@shared/types/ninja.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { ref, watch } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { Category } from '@shared/types/bulky.types'
import { useApi } from '@web/api/useApi'
import { BULKY_ID } from '@web/utility/typedId'
import { nodeApi } from '@web/api/nodeApi'

export function usePoeNinja() {
	const appStateStore = useAppStateStore()

	const prices = ref<CurrentNinjaPrices>({})

	/**
	 * Load the current category's prices whenever the category changes.
	 */
	watch(
		() => appStateStore.selectedCategory,
		category => {
			updateStateVariable(category).then(state => {
				prices.value = state
			})
		},
		{ immediate: true }
	)

	return { prices }
}

// LOCAL API

/**
 * Load the current category's prices from idb.
 */
async function updateStateVariable(category: Category) {
	// Try to find the correct poe.ninja category.
	const ninjaCategory = bulkyToNinjaCategory(category)
	if (!ninjaCategory) return {}

	// Get an existing or a new price block for this category.
	const priceBlock = await updateNinjaCategoryPrices(ninjaCategory)

	// Transform the price block into the form expected by the state variable
	return transformPriceBlockToState(priceBlock)
}

/**
 * Map a bulky defined category into the corresponding poe.ninja category.
 */
function bulkyToNinjaCategory(bulkyCategory: Category): PoeNinjaCategory | undefined {
	if (bulkyCategory === 'ESSENCE') return 'Essence'
	else if (bulkyCategory === 'SCARAB') return 'Scarab'
	else if (bulkyCategory === 'DELI_ORB') return 'DeliriumOrb'
	return undefined
}

/**
 * Load prices for new categories.
 * This function first attempts to get the category from idb.
 * If the last snapshot is older than 30 minutes or it can't find it, it will download it
 * from poe.ninja instead.
 */
async function updateNinjaCategoryPrices(categories: PoeNinjaCategory | PoeNinjaCategory[]) {
	const bulkyIdb = useBulkyIdb()

	if (typeof categories === 'string') {
		categories = [categories]
	}

	const priceBlocks = await Promise.all(
		categories.map(async category => {
			// Fetch the category from idb.
			const priceBlock = await bulkyIdb.getPriceBlockByCategory(category)

			// Return the saved price block if the last snapshot is not older than 30 minutes
			if (priceBlock && Date.now() - priceBlock.lastSnapshot < 30 * 60 * 1000) return priceBlock

			// Fetch the category from the poe.ninja API instead.
			// TODO: change ninja api to go through node backend
			const request = useApi('ninjaRequest', nodeApi.getNinjaCategory)
			await request.exec(category)

			// If the request errors, return the saved price block (or undefined if it doesn't exist)
			if (request.error.value || !request.data.value) {
				console.log({ ninjaError: request.error.value })
				return priceBlock
			}

			const newPriceBlock = transformNinjaResponseToPriceBlock(request.data.value, category)

			// Save the new data to idb.
			await bulkyIdb.putPriceBlock(newPriceBlock)

			return newPriceBlock
		})
	)

	return priceBlocks.filter(Boolean)
}

/**
 * Consume a poe.ninja API response and transform it into a price block.
 * This function can handle both the 'currency line' and 'item line' format.
 */
function transformNinjaResponseToPriceBlock(
	ninjaResponse: Record<'lines', PoeNinjaCurrencyLine[] | PoeNinjaItemLine[]>,
	category: PoeNinjaCategory
) {
	const items = ninjaResponse.lines.map((line: PoeNinjaCurrencyLine | PoeNinjaItemLine) => {
		// Narrow line type by checking for an exclusive property.
		return {
			id: BULKY_ID.generateTypedId<BulkyNinjaPriceItem>(line.detailsId),
			name: 'chaosEquivalent' in line ? line.currencyName : line.name,
			chaos: 'chaosEquivalent' in line ? line.chaosEquivalent : line.chaosValue,
			tendency: 'chaosEquivalent' in line ? line.receiveSparkLine.totalChange : line.sparkline.totalChange,
		}
	})

	const priceBlock: BulkyNinjaPriceBlock = {
		category,
		lastSnapshot: Date.now(),
		items,
	}

	return priceBlock
}

/**
 * Transform a price block to the form expected by the state variable.
 */
function transformPriceBlockToState(priceBlocks: BulkyNinjaPriceBlock | BulkyNinjaPriceBlock[]): CurrentNinjaPrices {
	if (!Array.isArray(priceBlocks)) {
		priceBlocks = [priceBlocks]
	}

	const state = {} as CurrentNinjaPrices

	// Loop over every block / category and combine the results into one state variable
	priceBlocks.forEach(block => {
		block.items.reduce((prevState, currItem) => {
			// Filter out maps below t16
			if (block.category === 'Map' && !(currItem.id.match(/t16/gi) || currItem.id.match(/t17/gi))) return prevState
			prevState[currItem.name] = currItem
			return prevState
		}, state)
	})

	return state
}
