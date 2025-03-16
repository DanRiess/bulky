import { ApiStatus } from '@web/api/api.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import { NinjaCategory, NinjaItem, NinjaPriceCollection, PreprocessedNinjaFile } from '@shared/types/ninja.types'
import { BULKY_ID } from '@web/utility/typedId'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { useConfigStore } from './configStore'

/**
 * This store exposes necessary global PoE Ninja data.
 * Currently, that is only chaos per div.
 * DO NOT use this to get price info for a shop offer.
 * That MUST be done via the usePoeNinja composable.
 */
export const useNinjaStore = defineStore('ninjaStore', () => {
	// STORES
	const configStore = useConfigStore()

	// INTERNAL STATE
	const bulkyIdb = useBulkyIdb()
	const UPDATE_INTERVAL = 30 * 60 * 1000
	const ninjaUpdateRequest = useApi('ninjaRequest', nodeApi.getNinjaData)
	const lastSnapshotByLeague: Record<string, number> = {}

	// EXPOSED STATE
	const { prices } = usePoeNinja('CURRENCY')
	const loadingStatus = ref<ApiStatus>('IDLE')
	const chaosPerDiv = computed(() => {
		const div = prices.value.get('Divine Orb')
		return div?.chaos ?? 0
	})

	// METHODS

	/**
	 * Expose this function to let other functions trigger data update if necessary.
	 */
	async function maybeTriggerDataUpdate(lastSnapshot: number) {
		// The passed lastSnapshot persists the app, because it is pulled from idb.
		if (lastSnapshot + UPDATE_INTERVAL > Date.now()) return

		// The lastSnapshotByLeague tracker does not persist the app.
		// However, it comes into effect if ninja is unavailable or doesn't track the current league.
		if (lastSnapshot[configStore.config.league] + UPDATE_INTERVAL > Date.now()) return

		// If the request is in progress, return as well.
		if (ninjaUpdateRequest.statusPending.value) return

		return await updateNinjaData(configStore.config.league)
	}

	/**
	 * Downloads ninja data, processes it and uploads it to IDB.
	 */
	async function updateNinjaData(league: string) {
		if (ninjaUpdateRequest.statusPending.value) return

		await ninjaUpdateRequest.exec(league)

		// Request unsuccessful, don't do anything and keep using stale data.
		if (ninjaUpdateRequest.error.value || !ninjaUpdateRequest.data.value) return

		const priceCollections = postProcessNinjaData(ninjaUpdateRequest.data.value, league)

		// Save the new data to idb.
		await bulkyIdb.putPriceCollections(priceCollections)

		// Update the snapshot tracker.
		lastSnapshotByLeague[league] = Date.now()

		// Emit event that other parts of the code can listen to to update their state.
		window.dispatchEvent(new CustomEvent('ninja-idb-updated'))

		return priceCollections
	}

	/**
	 * Converts the minified ninja data into Bulky's object style.
	 */
	function postProcessNinjaData(file: PreprocessedNinjaFile, league: string) {
		const priceCollections = file.map((data): NinjaPriceCollection => {
			const category = data.category

			const items: NinjaItem[] = data.items.map(item => {
				const id = item[2] ? `${item[0]}_t${item[2]}` : item[0]
				return {
					id: BULKY_ID.generateTypedId<NinjaItem>(id),
					name: item[0],
					chaos: item[1],
					mapTier: item[2],
				}
			})

			return {
				category,
				league,
				items,
				lastSnapshot: Date.now(),
			}
		})

		// Deduplicate categories and return them.
		return deduplicateByCategory(priceCollections)
	}

	/**
	 * Consumes an array of NinjaPriceCollections and merges collections of the same category.
	 * E. g. Fragments are duplicated in the ninja response.
	 */
	function deduplicateByCategory(collections: NinjaPriceCollection[]) {
		const categoryMap = new Map<NinjaCategory, NinjaPriceCollection>()

		for (const collection of collections) {
			if (categoryMap.has(collection.category)) {
				// Merge items into the first occurrence
				categoryMap.get(collection.category)!.items.push(...collection.items)
			} else {
				// Store the first occurrence
				categoryMap.set(collection.category, { ...collection, items: [...collection.items] })
			}
		}

		return Array.from(categoryMap.values())
	}

	return {
		// prices,
		loadingStatus,
		chaosPerDiv,
		maybeTriggerDataUpdate,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNinjaStore, import.meta.hot))
}
