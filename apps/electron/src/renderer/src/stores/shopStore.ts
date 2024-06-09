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
	 * Generate a reactive BulkyOffer.
	 * Use this as reactive baseline when creating a new offer.
	 * Only push this to the 'offers' state variable on user request and after validation.
	 */
	// function createReactiveOffer(): Ref<BulkyOffer> {
	// 	return ref({
	// 		uuid: BULKY_UUID.generateTypedUuid<BulkyOffer>(),
	// 		user: authStore.profile?.name ?? '',
	// 		ign: configStore.config.ign,
	// 		league: configStore.config.league,
	// 		category: appStateStore.selectedCategory,
	// 		chaosPerDiv,
	// 		multiplier: 1,
	// 		minimumBuyout: 0,
	// 		fullBuyout: false,
	// 		items: [],
	// 	})
	// }

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
