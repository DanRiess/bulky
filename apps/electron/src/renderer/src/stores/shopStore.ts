import { BulkyOffer } from '@shared/types/bulky.types'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useShopStore = defineStore('shopStore', () => {
	const bulkyIdb = useBulkyIdb()

	// STATE
	const offers = ref([]) as Ref<BulkyOffer[]>

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
		getOfferByUuid,
		putOffer,
	}
})
