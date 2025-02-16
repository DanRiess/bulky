import {
	BulkyBazaarOfferDto,
	BulkyShopItem,
	BulkyShopItemRecord,
	BulkyShopOffer,
	ShopFilter,
	TotalPrice,
} from '@shared/types/bulky.types'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { defineStore } from 'pinia'
import { Ref, UnwrapRef, computed, ref, toValue } from 'vue'
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
import { useAuthStore } from './authStore'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { BULKY_UUID } from '@web/utility/uuid'
import { useAppStateStore } from './appStateStore'
import { useConfigStore } from './configStore'
import { useFilterShopItems } from '@web/composables/useFilterShopItems'
import { replaceExpeditionLogbook } from '@web/utility/replaceExpeditionLogbooks'
import { ShopExpeditionItem } from '@web/categories/expedition/expedition.types'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import { useNinjaStore } from './ninjaStore'

/** TTL of any given offer. Default to 15 minutes. */
const OFFER_TTL = parseInt(import.meta.env.VITE_OFFER_TTL ?? 900000)

/** Declare the interval for automatic offer resync. Default to 10 minutes. */
const AUTO_SYNC_INTERVAL = parseInt(import.meta.env.VITE_OFFER_AUTOSYNC_INTERVAL ?? 600000)

export const useShopStore = defineStore('shopStore', () => {
	const bulkyIdb = useBulkyIdb()
	const stashStore = useStashStore()
	const authStore = useAuthStore()
	const appStateStore = useAppStateStore()
	const configStore = useConfigStore()
	const ninjaStore = useNinjaStore()

	// STATE
	const offers = ref<BulkyShopOffer[]>([])

	// GETTERS
	const maximumOffersReached = computed(() => offers.value.length >= parseInt(import.meta.env.VITE_MAXIMUM_OFFER_AMOUNT))

	// METHODS

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
			offer.active = timeSinceLastUpdate < OFFER_TTL

			// Check if the project needs to be refreshed.
			if (offer.autoSync && timeSinceLastUpdate > AUTO_SYNC_INTERVAL) {
				console.log(`auto sync triggered for offer ${offer.category}`)
				await recomputeOffer(offer.uuid)
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
	 * Generate a new offer.
	 */
	function generateOffer(options: {
		itemRecord: BulkyShopItemRecord
		ign: string
		chaosPerDiv: number
		minBuyout: TotalPrice
		multiplier?: number
		fullBuyout?: boolean
		filter?: ShopFilter
	}) {
		// TODO: Handle errors
		if (!authStore.profile?.name) {
			console.log('You have to sign in before creating a new offer')
			return
		}

		const items: UnwrapRef<BulkyShopItem>[] = []
		let computedMultiplier = options.multiplier

		options.itemRecord.forEach(item => {
			if (!item.selected) return

			// Push the item to the array if it fulfills the respective category's checks.
			if (appStateStore.selectedCategory === 'MAP_8_MOD') {
				if (!item.priceOverrideMap8Mod) return
				items.push(deepToRaw(item))
			} else {
				if (toValue(item.price) === 0 && toValue(item.priceOverride) === 0) return
				items.push(deepToRaw(item))
			}

			// calculate the multiplier for this item
			if (computedMultiplier) {
				const itemMultiplier = toValue(item.priceOverride) / toValue(item.price)
				if (toValue(item.price) !== 0 && itemMultiplier > computedMultiplier) {
					computedMultiplier = itemMultiplier
				}
			}
		})

		if (items.length === 0) {
			console.log('There are no valid items in your offer')
			return
		}

		const fullPrice = useAggregateItemPrice(options.itemRecord, options.multiplier ?? 1)
		const stashTabIds = stashStore.selectedStashTabs.map(t => t.id)

		const offer: BulkyShopOffer = {
			uuid: BULKY_UUID.generateTypedUuid<BulkyShopOffer>(),
			user: authStore.profile.name,
			ign: options.ign,
			stashTabIds,
			multiplier: options.multiplier,
			computedMultiplier,
			minimumBuyout: options.minBuyout,
			fullBuyout: options.fullBuyout,
			chaosPerDiv: options.chaosPerDiv,
			category: appStateStore.selectedCategory,
			league: configStore.config.league,
			items,
			filter: options.filter,
			lastUploaded: 0,
			fullPrice: fullPrice?.value,
			active: false,
			autoSync: true,
		}

		return offer
	}

	/**
	 * Update an existing offer.
	 */
	function updateOffer(offer: BulkyShopOffer, itemRecord: BulkyShopItemRecord) {
		const items: UnwrapRef<BulkyShopItem>[] = []
		let computedMultiplier = offer.multiplier

		itemRecord.forEach(item => {
			if (!item.selected) return

			// Push the item to the array if it fulfills the respective category's checks.
			if (offer.category === 'MAP_8_MOD') {
				if (!item.priceOverrideMap8Mod) return
				items.push(deepToRaw(item))
			} else {
				if (toValue(item.price) === 0 && toValue(item.priceOverride) === 0) return
				items.push(deepToRaw(item))
			}

			// calculate the multiplier for this item
			if (computedMultiplier) {
				const itemMultiplier = toValue(item.priceOverride) / toValue(item.price)
				if (toValue(item.price) !== 0 && itemMultiplier > computedMultiplier) {
					computedMultiplier = itemMultiplier
				}
			}
		})

		const fullPrice = useAggregateItemPrice(itemRecord, offer.multiplier ?? 1)
		const stashTabIds = stashStore.selectedStashTabs.map(t => t.id)

		offer.stashTabIds = stashTabIds
		offer.items = items
		offer.fullPrice = fullPrice.value
		offer.computedMultiplier = computedMultiplier
		offer.chaosPerDiv = ninjaStore.chaosPerDiv > 0 ? ninjaStore.chaosPerDiv : offer.chaosPerDiv

		return offer
	}

	/**
	 * Put an offer into the state variable and idb.
	 */
	async function putOffer(offer: BulkyShopOffer) {
		// Don't put the offer if the user has already created too many.
		if (maximumOffersReached.value) return

		const offerIdx = offers.value.findIndex(oldOffer => oldOffer.uuid === offer.uuid)

		// Offer already exists, edit it.
		if (offerIdx > -1) {
			offers.value[offerIdx] = offer
		} else {
			offers.value.push(offer)
		}

		const offerDto = generateDto(offer)
		console.log({ offerDto })

		if (!offerDto) {
			console.log('could not generate dto')
			return
		}

		// Upload offer to the public db.
		const putRequest = useApi('putOffer', nodeApi.putOffer)
		await putRequest.exec(offerDto)

		// If the upload succeeds, update some properties.
		if (putRequest.data.value) {
			offer.lastUploaded = offerDto.timestamp
			offer.active = true
		}

		// Put the offer to idb.
		await bulkyIdb.putShopOffer(offer)
	}

	/**
	 * Completely recompute an offer.
	 *
	 * Refetch its stash tabs and update its items' prices with new Ninja values.
	 * Reapply the used filters if any are present.
	 * Reupload the offer and save it to IDB.
	 */
	async function recomputeOffer(uuid: BulkyShopOffer['uuid'], status?: Ref<ApiStatus>) {
		status && (status.value = 'PENDING')

		const offer = getOfferByUuid(uuid)

		if (!offer) {
			console.log('Offer not found')
			status && (status.value = 'ERROR')
			return
		}

		// Check if either Bulky or PoE is the current active window.
		// Don't upload if both are inactive.
		const activeWindowRequest = useApi('activeWindow', nodeApi.getActiveWindow)
		await activeWindowRequest.exec()
		const activeWindow = activeWindowRequest.data.value

		// This check is for dev only.
		if (activeWindow?.title.match('- Notepad')) {
			activeWindow.title = 'Notepad'
		}

		if (
			!activeWindow ||
			(activeWindow.title !== import.meta.env.VITE_APP_TITLE && activeWindow.title !== configStore.config.gameWindowTitle)
		) {
			return
		}

		// Get the stash tabs that were used by the offer.
		const stashTabs = offer.stashTabIds.map(id => stashStore.getStashTabById(id)).filter(Boolean)

		// Get the PoeItems from Idb and filter by the offer's category.
		const { filteredItemsByCategory, updateItemsByStash } = usePoeItems(stashTabs)
		const poeItems = filteredItemsByCategory(offer.category)

		// Generate BulkyItems from the PoeItems with prices and overrides.
		const { prices, loadingStatus: ninjaLoadingStatus } = usePoeNinja(offer.category)
		const { itemOverrides } = useItemOverrides(offer.category)
		const { items: itemRecord } = useBulkyItems(poeItems, prices, itemOverrides, offer.category)
		const { filteredItemRecord } = useFilterShopItems(itemRecord, offer.filter)

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
		let computedMultiplier = offer.multiplier

		filteredItemRecord.value.forEach(item => {
			if (!item.selected) return

			// Push the item to the array if it fulfills the respective category's checks.
			// 8 mod maps need a price override, since they can't be priced automatically.
			if (offer.category === 'MAP_8_MOD') {
				if (!item.priceOverrideMap8Mod) return
				items.push(deepToRaw(item))
			}
			// Expedition logbooks in the offer are generic.
			// They have to be split into their specific faction based on highest faction price.
			else if (offer.category === 'EXPEDITION' && item.type.match(/logbook/i)) {
				const logbooks = replaceExpeditionLogbook(item as ShopExpeditionItem, itemOverrides)
				Object.values(logbooks).forEach(logbook => {
					if (toValue(logbook.price) === 0 && toValue(logbook.priceOverride) === 0) return
					items.push(deepToRaw(logbook))
				})
			} else {
				if (toValue(item.price) === 0 && toValue(item.priceOverride) === 0) return
				items.push(deepToRaw(item))
			}

			// calculate the multiplier for this item
			if (computedMultiplier) {
				const itemMultiplier = toValue(item.priceOverride) / toValue(item.price)
				if (toValue(item.price) !== 0 && itemMultiplier > computedMultiplier) {
					computedMultiplier = itemMultiplier
				}
			}
		})

		// Calculate the full price.
		const fullPrice = useAggregateItemPrice(filteredItemRecord, offer.multiplier ?? 1)

		// Edit and reupload the offer.
		offer.fullPrice = fullPrice.value
		offer.items = items
		offer.computedMultiplier = computedMultiplier
		offer.chaosPerDiv = ninjaStore.chaosPerDiv

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

	function generateDto(offer: BulkyShopOffer): BulkyBazaarOfferDto | undefined {
		const account = authStore.profile?.name

		if (!account) {
			console.log('could not generate dto, no account name')
			return
		}

		const minimumBuyout = offer.minimumBuyout.divine * offer.chaosPerDiv + offer.minimumBuyout.chaos

		return {
			version: parseInt(import.meta.env.VITE_OFFER_VERSION ?? '1'),
			uuid: offer.uuid,
			timestamp: Date.now(),
			account,
			ign: offer.ign,
			category: offer.category,
			league: offer.league,
			chaosPerDiv: offer.chaosPerDiv,
			multiplier: offer.computedMultiplier,
			fullPrice: Math.round(offer.fullPrice),
			minimumBuyout,
			fullBuyout: offer.fullBuyout,
			items: offer.items.map(item => BULKY_TRANSFORM.bulkyItemToBazaarItemDto(item, offer.multiplier ?? 1)).filter(Boolean),
		}
	}

	return {
		offers,
		maximumOffersReached,
		initialize,
		getOfferByUuid,
		generateOffer,
		updateOffer,
		putOffer,
		recomputeOffer,
		deleteOffer,
	}
})
