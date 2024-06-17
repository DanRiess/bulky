import { BulkyItem, BulkyOffer } from '@shared/types/bulky.types'
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

export const useShopStore = defineStore('shopStore', () => {
	const bulkyIdb = useBulkyIdb()
	const stashStore = useStashStore()

	// STATE
	const offers = ref<BulkyOffer[]>([])

	// METHODS

	/**
	 * Set all initial state variables.
	 * - Get saved shop offers from idb.
	 */
	async function initialize() {
		offers.value = await bulkyIdb.getShopOffersByLeague()
	}

	/**
	 * Retrieve an offer by its uuid.
	 */
	function getOfferByUuid(uuid: BulkyOffer['uuid']) {
		return offers.value.find(offer => offer.uuid === uuid)
	}

	/**
	 * Put an offer into the state variable and idb.
	 */
	async function putOffer(offer: BulkyOffer) {
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

	async function refreshOffer(uuid: BulkyOffer['uuid'], status?: Ref<ApiStatus>) {
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
		const { prices, chaosPerDiv, loadingStatus: ninjaLoadingStatus } = usePoeNinja(offer.category)
		const { itemOverrides } = useItemOverrides()
		const { items: itemRecord } = useBulkyItems(poeItems, prices, itemOverrides)

		// Resync the stash tabs
		const stashTabRequest = useFetchStashItems(stashTabs)
		await stashTabRequest.execute()

		if (stashTabRequest.data.value) {
			await updateItemsByStash(stashTabRequest.data.value)
		}

		// Wait while the prices are being loaded from server or IDB.
		while (ninjaLoadingStatus.value === 'IDLE' || ninjaLoadingStatus.value === 'PENDING') {
			await sleepTimer(150)
		}

		// Flatten the BulkyItemRecord into a non-reactive array.
		const items: UnwrapRef<BulkyItem>[] = []

		itemRecord.value.forEach(item => {
			if (!item.selected) return
			items.push(deepToRaw(item))
		})

		// Calculate the full price.
		const fullPrice = useAggregateItemPrice(itemRecord, offer.multiplier, chaosPerDiv)

		// Edit and reupload the offer.
		offer.fullPrice = fullPrice.value
		offer.items = items

		await putOffer(offer)

		status && (status.value = 'SUCCESS')
	}

	return {
		offers,
		initialize,
		getOfferByUuid,
		putOffer,
		refreshOffer,
	}
})
