import { BulkyOffer } from '@shared/types/bulky.types'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useShopStore = defineStore('shopStore', () => {
	const bulkyIdb = useBulkyIdb()

	// STATE
	const offers: Ref<BulkyOffer[]> = ref([])

	// METHODS

	/**
	 * Set all initial state variables.
	 *
	 * - Get saved shop offers from idb.
	 */
	async function initialize() {
		offers.value = await bulkyIdb.getShopOffersByLeague()
	}

	/**
	 * Retrieve an offer by its uuid.
	 */
	function getOfferByUuid(uuid: BulkyOffer['uuid']): BulkyOffer | undefined {
		return offers.value.find(offer => offer.uuid === uuid)
	}

	/**
	 * Proxy function to get the 'offers' ref and avoid simplifying its type.
	 *
	 * Using the exported 'offers' in components (i.e. shopStore.offers or storeToRefs(offers)) will
	 * for some reason mess up its type. These offers then cannot be passed to functions
	 * anymore without throwing a ts error.
	 *
	 * @example
	 * const { offers } = storeToRefs(shopStore)
	 * shopStore.putOffer(offers.value[0]) // will throw, although it shouldn't
	 *
	 * const offers = shopStore.getOffers()
	 * shopStore.putOffer(offers.value[0]) // ok!
	 */
	function getOffers() {
		return offers
	}

	/**
	 * Put an offer into the state variable and idb.
	 */
	async function putOffer(offer: BulkyOffer) {
		const offerIdx = offers.value.findIndex(oldOffer => oldOffer.uuid === offer.uuid)

		// Offer exists already, edit it
		if (offerIdx > -1) {
			offers.value[offerIdx] = offer
		}

		// Offer does not exist already, push it
		else {
			offers.value.push(offer)
		}

		// Put the offer to idb
		await bulkyIdb.putShopOffer(offer)

		// Upload offer to the public db
	}

	return {
		offers,
		// createReactiveOffer,
		initialize,
		getOffers,
		getOfferByUuid,
		putOffer,
	}
})
