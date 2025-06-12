<template>
	<div class="m-shop-offer flow animated-gradient-background" data-b-override>
		<section class="title-section">
			<div class="offer-main-info">
				<ImgCategoryAtom :category="offer.category" /> |
				<PriceAtom label="" :price="divPrice" />
			</div>
			<div class="offer-meta-info">
				<div>
					Posted: <span :class="{ 'error-color': !offer.timestamps.length }">{{ timeAgoDisplay }}</span>
				</div>
				<div>
					League: <span :class="{ 'error-color': disabled }">{{ offer.league }}</span>
				</div>
			</div>
		</section>
		<ShopOfferItemCollectionMolecule
			:items="offer.items"
			:category="offer.category"
			:price-multiplier="offer.multiplier ?? 1" />
		<ShopOfferConfigMolecule :offer="offer" />
		<section class="footer-section">
			<div class="info-toggles">
				<ActiveOrInactiveAtom :active="offer.active" />
				<div>|</div>
				<SvgIconAtom v-bind="autoSyncProps" @click="toggleAutoSync" :disabled="disabled" />
				<TransitionAtom v-on="transitionHooks">
					<div class="auto-sync-tooltip" v-if="showAutoSyncTooltip">
						{{ offer.autoSync ? 'Auto Sync Enabled' : 'Auto Sync Disabled' }}
					</div>
				</TransitionAtom>
			</div>
			<div class="actions">
				<SvgButtonWithPopupMolecule
					:svg-props="{
						name: 'refresh',
						rotate: refreshState === 'PENDING',
						useGradient: refreshState === 'PENDING',
					}"
					:tooltip-props="tooltipProps"
					background-color="dark"
					:disabled="!authStore.isLoggedIn || disabled"
					@click="refreshOffer(offer.uuid)">
					Refresh Offer
					<template v-if="offerCooldown">(3 minute CD)</template>
				</SvgButtonWithPopupMolecule>

				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'edit' }"
					:tooltip-props="tooltipProps"
					background-color="dark"
					:disabled="!authStore.isLoggedIn || disabled"
					@click="editOffer(offer.uuid)">
					Edit Offer
					<template v-if="offerCooldown">(3 minute CD)</template>
				</SvgButtonWithPopupMolecule>

				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'trash' }"
					:tooltip-props="tooltipProps"
					background-color="dark"
					:disabled="!authStore.isLoggedIn"
					@click="deleteOffer(offer)">
					Delete Offer
					<template v-if="offerCooldown">(3 minute CD)</template>
				</SvgButtonWithPopupMolecule>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { BulkyShopOffer } from '@shared/types/bulky.types'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PriceAtom from '../atoms/PriceAtom.vue'
import ShopOfferItemCollectionMolecule from './ShopOfferItemCollectionMolecule.vue'
import ShopOfferConfigMolecule from './ShopOfferConfigMolecule.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import { TooltipPropsWithoutActive } from '../atoms/ButtonTooltipAtom.vue'
import ActiveOrInactiveAtom from '../atoms/ActiveOrInactiveAtom.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { ApiStatus } from '@web/api/api.types'
import { useShopStore } from '@web/stores/shopStore'
import { useTimeAgo } from '@vueuse/core'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'
import { useRouter } from 'vue-router'
import ImgCategoryAtom from '../atoms/ImgCategoryAtom.vue'
import { useAuthStore } from '@web/stores/authStore'
import { useConfigStore } from '@web/stores/configStore'
import { useNotificationStore } from '@web/stores/notificationStore'

// STORES
const shopStore = useShopStore()
const authStore = useAuthStore()
const configStore = useConfigStore()
const notificationStore = useNotificationStore()

// MODELS
const offer = defineModel<BulkyShopOffer>({ required: true })

// STATE
const bulkyIdb = useBulkyIdb()
const offerCooldown = ref(false)
const showAutoSyncTooltip = ref(false)
/** Used to show a visual indicator while refresh is in progress. */
const refreshState = ref<ApiStatus>('IDLE')
const autoSyncTimeout = ref<NodeJS.Timeout>()
/** An abstraction, since multiple subcomponents need to consume a tooltip prop. */
const tooltipProps: TooltipPropsWithoutActive = {
	position: 'top',
	transitionDirection: 'toTop',
	popupAlignment: 'left',
}
/** Timeout has to be manually cleared on unmounting */
let timeout: NodeJS.Timeout | undefined = undefined

// COMPOSABLES
const router = useRouter()
const timeAgo = useTimeAgo(() => offer.value.timestamps[offer.value.timestamps.length - 1] ?? 0)
const timeAgoDisplay = computed(() => {
	if (offer.value.timestamps.length === 0) {
		return 'Failed to upload!'
	}
	return timeAgo.value
})
const divPrice = useChaosToDiv(() => offer.value.fullPrice, offer.value.chaosPerDiv)
const transitionHooks = useGenericTransitionHooks({
	duration: 0.15,
	opacity: 0,
	scaleX: 0.01,
})

// GETTERS

/**
 * Properties for the svg icon that handles the visualization of 'offer.autoSync'
 */
const autoSyncProps = computed(() => {
	return {
		name: offer.value.autoSync ? 'sync' : 'syncDisabled',
		color: offer.value.autoSync ? 'var(--color-success)' : 'var(--color-error)',
		cursor: 'pointer',
	} as const
})

/**
 * Disables the offer if its league doesn't match the currently selected one.
 */
const disabled = computed(() => {
	return offer.value.league !== configStore.config.league
})

// METHODS

/**
 * Toggles an offer's auto sync property.
 * The function also handles toggling a timed tooltip as an indicator.
 */
async function toggleAutoSync() {
	// Return if the offer value is less than what is configured.
	if (offer.value.league !== configStore.config.league) return
	if (offer.value.fullPrice < configStore.config.shop.autoUploadPriceFloor) return

	// Clear the previous timeout
	clearTimeout(autoSyncTimeout.value)

	offer.value.autoSync = !offer.value.autoSync
	await bulkyIdb.putShopOffer(offer.value)

	showAutoSyncTooltip.value = true
	autoSyncTimeout.value = setTimeout(() => {
		showAutoSyncTooltip.value = false
	}, 2000)
}

/**
 * Refresh an offer manually if the cooldown is up.
 */
function refreshOffer(uuid: BulkyShopOffer['uuid']) {
	if (offerCooldown.value) {
		const notification = notificationStore.createErrorNotification({
			message: 'Offers can be refreshed at most once every 3 minutes.',
		})
		notificationStore.addErrorNotification(notification)
		return
	}
	shopStore.recomputeOffer(uuid, { status: refreshState })
}

/**
 * Open the edit offer dialogue if the cooldown is up.
 */
function editOffer(uuid: BulkyShopOffer['uuid']) {
	if (offerCooldown.value) {
		const notification = notificationStore.createErrorNotification({
			message: 'Offers can be edited at most once every 3 minutes.',
		})
		notificationStore.addErrorNotification(notification)
		return
	}
	router.push({
		name: 'EditOffer',
		params: {
			uuid: uuid,
		},
	})
}

/**
 * Delete an offer.
 * Also use the cooldown here to avoid the possibility to delete and then recreate an offer.
 * Currently commented because auto sync can cause bugs where no items are being uploaded.
 */
function deleteOffer(offer: BulkyShopOffer) {
	// if (offerCooldown.value) {
	// 	const notification = notificationStore.createErrorNotification({
	// 		message: 'Offers can be deleted at most once every 3 minutes.',
	// 	})
	// 	notificationStore.addErrorNotification(notification)
	// 	return
	// }

	shopStore.deleteOffer(offer)
}

// HOOKS
onMounted(() => {
	// Turn off auto sync if the league doesn't match or the offer is worth less than 100c.
	if (offer.value.league !== configStore.config.league || offer.value.fullPrice < 100) {
		offer.value.autoSync = false
	}

	// Check once on component load if the offer cooldown is up.
	const timeSinceLastUpload = Date.now() - (offer.value.timestamps[offer.value.timestamps.length - 1] ?? 0)
	offerCooldown.value = timeSinceLastUpload < 180000

	// Afterwards, check if the offer cooldown is up once every 5 seconds.
	timeout = setInterval(() => {
		const timeSinceLastUpload = Date.now() - (offer.value.timestamps[offer.value.timestamps.length - 1] ?? 0)
		offerCooldown.value = timeSinceLastUpload < 180000
	}, 5000)
})

onBeforeUnmount(() => {
	clearInterval(timeout)
})
</script>

<style scoped>
.m-shop-offer {
	display: grid;
	/* width: max-content; */
	min-width: 25rem;
	padding: 1rem;
	border-radius: var(--border-radius-medium);
}

.title-section {
	display: flex;
	justify-content: space-between;
}

.offer-main-info {
	display: flex;
	height: 1.5rem;
	gap: 0.5rem;
}

.offer-meta-info {
	max-width: 13rem;
	overflow-x: auto;
	white-space: nowrap;
}

.footer-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.info-toggles {
	display: flex;
	height: 1.5rem;
	gap: 0.5rem;
	user-select: none;
}

.actions {
	display: flex;
	gap: 0.5rem;
}

.auto-sync-tooltip {
	font-size: 0.8rem;
	transform-origin: left;
	background-color: black;
	padding: 0.25rem;
	border-radius: var(--border-radius-small);
	display: flex;
	align-items: center;
}
</style>
