import { BulkyShopItem, BulkyShopOffer } from '@shared/types/bulky.types'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { defineStore } from 'pinia'
import { Ref, UnwrapRef, ref } from 'vue'
import { useStashStore } from './stashStore'
import { usePoeItems } from '@web/composables/usePoeItems'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useItemOverrides } from '@web/composables/useItemOverrides'
import { useBulkyItems } from '@web/composables/useBulkyItems'
import { deepToRaw } from '@web/utility/deepToRaw'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { ApiStatus } from '@web/api/api.types'
import { sleepTimer } from '@web/utility/sleep'
import { useFetchStashItems } from '@web/composables/useFetchStashItems'

/** TTL of any given offer. Default to 15 minutes. */
const offerTtl = parseInt(import.meta.env.VITE_OFFER_TTL ?? 900000)

/** Declare the interval for automatic offer resync. Default to 10 minutes. */
const autoSyncInterval = parseInt(import.meta.env.VITE_OFFER_AUTOSYNC_INTERVAL ?? 600000)

export const useShopStore = defineStore('shopStore', () => {
	const bulkyIdb = useBulkyIdb()
	const stashStore = useStashStore()

	// STATE
	const offers = ref<BulkyShopOffer[]>([])

	/**
	 * Every 30 seconds, check all offers.
	 * Decide if the active status has to change.
	 * If auto resync is enabled, reupload the offer if the appropriate amount of time has passed.
	 *
	 * Start the cycle in the initialize function.
	 */
	async function regularUpdate() {
		for await (const offer of offers.value) {
			// Define flags for deciding whether the offer has changed and needs to be put into IDB.
			const active = offer.active

			const timeSinceLastUpdate = Date.now() - offer.lastUploaded

			// Check the active property.
			offer.active = timeSinceLastUpdate < offerTtl

			// Check if the project needs to be refreshed.
			if (offer.autoSync && timeSinceLastUpdate > autoSyncInterval) {
				console.log(`auto sync triggered for offer ${offer.category}`)
				await refreshOffer(offer.uuid)
			}

			// Refreshing the offer already puts it into IDB, so this condition is only relevant otherwise.
			else if (active !== offer.active) {
				bulkyIdb.putShopOffer(offer)
			}
		}

		setTimeout(regularUpdate, 30000)
	}

	// METHODS

	/**
	 * Set all initial state variables.
	 * - Get saved shop offers from idb.
	 */
	async function initialize() {
		offers.value = await bulkyIdb.getShopOffersByLeague()

		await regularUpdate()
	}

	/**
	 * Retrieve an offer by its uuid.
	 */
	function getOfferByUuid(uuid: BulkyShopOffer['uuid']) {
		return offers.value.find(offer => offer.uuid === uuid)
	}

	/**
	 * Put an offer into the state variable and idb.
	 */
	async function putOffer(offer: BulkyShopOffer) {
		const offerIdx = offers.value.findIndex(oldOffer => oldOffer.uuid === offer.uuid)

		// Offer already exists, edit it
		if (offerIdx > -1) {
			offers.value[offerIdx] = offer
		} else {
			offers.value.push(offer)
		}

		// Upload offer to the public db

		// If the upload succeeds, update some properties
		// TODO: fix condition
		if (true) {
			offer.lastUploaded = Date.now()
			offer.active = true
		}

		// Put the offer to idb
		await bulkyIdb.putShopOffer(offer)
	}

	async function refreshOffer(uuid: BulkyShopOffer['uuid'], status?: Ref<ApiStatus>) {
		status && (status.value = 'PENDING')

		const offer = getOfferByUuid(uuid)

		if (!offer) {
			console.log('Offer not found')
			status && (status.value = 'ERROR')
			return
		}

		// Get the stash tabs that were used by the offer.
		const stashTabs = offer.stashTabIds.map(id => stashStore.getStashTabById(id)).filter(Boolean)

		// Get the PoeItems from Idb and filter by the offer's category.
		const { filterItemsByCategory, updateItemsByStash } = usePoeItems(stashTabs)
		const poeItems = filterItemsByCategory(offer.category)

		// Generate BulkyItems from the PoeItems with prices and overrides.
		const { prices, loadingStatus: ninjaLoadingStatus } = usePoeNinja(offer.category)
		const { itemOverrides } = useItemOverrides(offer.category)
		const { items: itemRecord } = useBulkyItems(poeItems, prices, itemOverrides, offer.category)

		// Resync the stash tabs
		const stashTabRequest = useFetchStashItems(stashTabs)
		await stashTabRequest.execute()

		if (stashTabRequest.data.value) {
			await updateItemsByStash(stashTabRequest.data.value)
		}

		// Wait while ninja prices are being loaded from server or IDB.
		while (ninjaLoadingStatus.value === 'IDLE' || ninjaLoadingStatus.value === 'PENDING') {
			await sleepTimer(150)
		}

		// Flatten the BulkyShopItemRecord into a non-reactive array.
		const items: UnwrapRef<BulkyShopItem>[] = []

		itemRecord.value.forEach(item => {
			if (!item.selected) return
			items.push(deepToRaw(item))
		})

		// Calculate the full price.
		const fullPrice = useAggregateItemPrice(itemRecord, offer.multiplier)

		// Edit and reupload the offer.
		offer.fullPrice = fullPrice.value
		offer.items = items

		await putOffer(offer)

		status && (status.value = 'SUCCESS')
	}

	async function deleteOffer(uuid: BulkyShopOffer['uuid']) {
		const offerIdx = offers.value.findIndex(oldOffer => oldOffer.uuid === uuid)

		// TODO: handle error
		if (offerIdx < 0) {
			console.log('Offer not found')
			return
		}

		// Remove the offer from the public db.

		// If the deletion succeeds, remove the offer from idb and the array
		// TODO: fix condition
		if (true) {
			await bulkyIdb.deleteShopOffer(uuid, offers.value[offerIdx].league)
			offers.value.splice(offerIdx, 1)
		}
	}

	return {
		offers,
		initialize,
		getOfferByUuid,
		putOffer,
		refreshOffer,
		deleteOffer,
	}
})
