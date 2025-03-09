import {
	NinjaPriceCollection,
	NinjaItem,
	NinjaPriceRecord,
	NinjaCategory,
	NinjaCurrencyDto,
	NinjaItemDto,
} from '@shared/types/ninja.types'
import { MaybeRefOrGetter, Ref, ref, toValue, watch } from 'vue'
import { useBulkyIdb } from './useBulkyIdb'
import { Category } from '@shared/types/bulky.types'
import { useApi } from '@web/api/useApi'
import { BULKY_ID } from '@web/utility/typedId'
import { nodeApi } from '@web/api/nodeApi'
import { useConfigStore } from '@web/stores/configStore'
import { isWatchable } from '@shared/types/utility.types'
import { ApiStatus } from '@web/api/api.types'

const UPDATE_INTERVAL = 30 * 60 * 1000

/**
 * Composable that will hold the prices of the currently selected category.
 * Categories will be updated every 30 minutes if they are in use.
 */
export function usePoeNinja(category: MaybeRefOrGetter<Category>) {
	const prices = ref<NinjaPriceRecord>(new Map())
	const loadingStatus = ref<ApiStatus>('IDLE')

	// Load the current category's prices whenever the category changes.
	if (isWatchable(category)) {
		watch(
			category,
			category => {
				loadingStatus.value = 'PENDING'

				updateStateVariables(prices, category)
					.then(() => (loadingStatus.value = 'SUCCESS'))
					.catch(() => (loadingStatus.value = 'ERROR'))
			},
			{ immediate: true }
		)
	}

	// If 'category' is not watchable, load it here once
	else {
		loadingStatus.value = 'PENDING'

		updateStateVariables(prices, category)
			.then(() => (loadingStatus.value = 'SUCCESS'))
			.catch(() => (loadingStatus.value = 'ERROR'))
	}

	return { prices, loadingStatus }
}

// LOCAL API

/**
 * Ease of use function to update the state variables.
 * Artifact of an older code base where chaos per div was calculated here as well.
 */
async function updateStateVariables(prices: Ref<NinjaPriceRecord>, category: MaybeRefOrGetter<Category>) {
	prices.value = await getPricesByCategory(toValue(category))
}

/**
 * Load the current category's prices from idb.
 */
async function getPricesByCategory(category: Category): Promise<NinjaPriceRecord> {
	// Try to find the correct poe.ninja category.
	const ninjaCategories = bulkyToNinjaCategory(category)
	if (!ninjaCategories) return new Map()

	// Get an existing or a new price collection for this category.
	const priceCollections = await updateNinjaCategoryPrices(ninjaCategories)

	// Transform the price collection into the form expected by the state variable
	return transformPriceCollectionToState(priceCollections)
}

/**
 * Map a bulky defined category into the corresponding poe.ninja category.
 */
function bulkyToNinjaCategory(bulkyCategory: Category): NinjaCategory[] | undefined {
	// TODO: enhance with more categories
	if (bulkyCategory === 'ESSENCE') return ['Essence']
	else if (bulkyCategory === 'SCARAB') return ['Scarab']
	else if (bulkyCategory === 'DELIRIUM_ORB') return ['DeliriumOrb']
	else if (bulkyCategory === 'MAP' || bulkyCategory === 'MAP_8_MOD') return ['Map', 'UniqueMap']
	else if (bulkyCategory === 'BESTIARY') return ['Beast']
	else if (bulkyCategory === 'DELVE') return ['Fossil', 'Resonator']
	else if (bulkyCategory === 'CATALYST') return ['Currency']
	else if (bulkyCategory === 'CURRENCY') return ['Currency']
	else if (bulkyCategory === 'EXPEDITION') return ['Artifact']
	else if (bulkyCategory === 'FRAGMENT') return ['Fragment', 'Currency']
	return undefined
}

/**
 * Load prices for new categories.
 * This function first attempts to get the category from idb.
 * If the last snapshot is older than 30 minutes or it can't find it, it will download it
 * from poe.ninja instead.
 */
async function updateNinjaCategoryPrices(categories: NinjaCategory | NinjaCategory[]) {
	const bulkyIdb = useBulkyIdb()

	if (typeof categories === 'string') {
		categories = [categories]
	}

	const priceCollections = await Promise.all(
		categories.map(async category => {
			// Fetch the category from idb.
			const priceCollection = await bulkyIdb.getPriceCollectionByCategory(category)

			// Return the saved price block if the last snapshot is not older than 30 minutes
			if (priceCollection && Date.now() - priceCollection.lastSnapshot < UPDATE_INTERVAL) return priceCollection

			// Fetch the category from the poe.ninja API instead.
			const request = useApi('ninjaRequest', nodeApi.getNinjaCategory)
			await request.exec(category)

			// If the request errors, return the saved price block (or undefined if it doesn't exist)
			if (request.error.value || !request.data.value || typeof request.data.value === 'string') {
				console.log({ ninjaError: request.error.value, category })
				return priceCollection
			}

			const newpriceCollection = transformNinjaResponseToPriceCollection(request.data.value, category)
			console.log({ newpriceCollection })

			// Save the new data to idb.
			await bulkyIdb.putPriceCollection(newpriceCollection)

			return newpriceCollection
		})
	)

	return priceCollections.filter(Boolean)
}

/**
 * Consume a poe.ninja API response and transform it into a price collection.
 * This function can handle both the 'currency line' and 'item line' format.
 */
function transformNinjaResponseToPriceCollection(
	ninjaResponse: Record<'lines', NinjaCurrencyDto[] | NinjaItemDto[]>,
	category: NinjaCategory
) {
	const configStore = useConfigStore()

	const items = ninjaResponse.lines.map((line: NinjaCurrencyDto | NinjaItemDto) => {
		// Narrow line type by checking for an exclusive property.
		return {
			id: BULKY_ID.generateTypedId<NinjaItem>(line.detailsId),
			name: 'chaosEquivalent' in line ? line.currencyTypeName : line.name,
			mapTier: !('chaosEquivalent' in line) && (category === 'Map' || category === 'UniqueMap') ? line.mapTier : undefined,
			chaos: 'chaosEquivalent' in line ? line.chaosEquivalent : line.chaosValue,
			tendency: 'chaosEquivalent' in line ? line.receiveSparkLine.totalChange : line.sparkline.totalChange,
		}
	})

	const priceCollection: NinjaPriceCollection = {
		category,
		league: configStore.config.league,
		lastSnapshot: Date.now(),
		items,
	}

	return priceCollection
}

/**
 * Transform a price block to the form expected by the state variable.
 */
function transformPriceCollectionToState(priceCollections: NinjaPriceCollection | NinjaPriceCollection[]): NinjaPriceRecord {
	if (!Array.isArray(priceCollections)) {
		priceCollections = [priceCollections]
	}

	const state: NinjaPriceRecord = new Map()

	// Loop over every block / category and combine the results into one state variable
	priceCollections.forEach(collection => {
		collection.items.reduce((prevState, currItem) => {
			// Save the tier into the key for map items.
			const key =
				collection.category === 'Map' || collection.category === 'UniqueMap'
					? `${currItem.name}_TIER_${currItem.mapTier}`
					: currItem.name

			// Filter out maps below t16
			// if (collection.category === 'Map' && !(currItem.id.match(/t16/gi) || currItem.id.match(/t17/gi))) return prevState

			prevState.set(key, currItem)
			return prevState
		}, state)
	})

	return state
}
