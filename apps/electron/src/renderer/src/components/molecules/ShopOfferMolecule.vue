<template>
	<div class="m-shop-offer flow animated-gradient-background" data-b-override>
		<section class="title-section">
			<div class="offer-main-info">
				<ImgCategoryAtom :category="offer.category" /> &ndash;
				<PriceAtom label="" :price="divPrice" />
			</div>
			<span>Posted: {{ timeAgo }}</span>
		</section>
		<ShopOfferItemCollectionMolecule :items="offer.items" />
		<ShopOfferConfigMolecule :offer="offer" />
		<section class="footer-section">
			<div class="info-toggles">
				<ActiveOrInactiveAtom :active="offer.active" />
				<div>&ndash;</div>
				<SvgIconAtom v-bind="autoSyncProps" @click="toggleAutoSync" />
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
					@click="refreshOffer(offer.uuid)">
					Refresh Offer
				</SvgButtonWithPopupMolecule>

				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'edit' }"
					:tooltip-props="tooltipProps"
					background-color="dark"
					@click="
						router.push({
							name: 'EditOffer',
							params: {
								uuid: offer.uuid,
							},
						})
					">
					Edit Offer
				</SvgButtonWithPopupMolecule>

				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'trash' }"
					:tooltip-props="tooltipProps"
					background-color="dark"
					@click="shopStore.deleteOffer(offer.uuid)">
					Delete Offer
				</SvgButtonWithPopupMolecule>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { BulkyShopOffer } from '@shared/types/bulky.types'
import { computed, ref } from 'vue'
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

// STORES
const shopStore = useShopStore()

// MODELS
const offer = defineModel<BulkyShopOffer>({ required: true })

// STATE
const bulkyIdb = useBulkyIdb()
const showAutoSyncTooltip = ref(false)
const refreshState = ref<ApiStatus>('IDLE')

// COMPOSABLES
const router = useRouter()
const timeAgo = useTimeAgo(() => offer.value.lastUploaded)
const divPrice = useChaosToDiv(() => offer.value.fullPrice, offer.value.chaosPerDiv)
const transitionHooks = useGenericTransitionHooks({
	duration: 0.15,
	opacity: 0,
	scaleX: 0.01,
})

// GETTERS
// const imgSource = computed(() => {
// 	if (offer.value.category === 'ESSENCE') {
// 		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9IYXRyZWQ3Iiwic2NhbGUiOjF9XQ/a69c5c06cc/Hatred7.png'
// 	} else if (offer.value.category === 'SCARAB') {
// 		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQnJlYWNoIiwic2NhbGUiOjF9XQ/b129897f73/GreaterScarabBreach.png'
// 	}
// 	return ''
// })

const tooltipProps: TooltipPropsWithoutActive = {
	position: 'top',
	transitionDirection: 'toTop',
	popupAlignment: 'left',
}

const autoSyncProps = computed(() => {
	return {
		name: offer.value.autoSync ? 'sync' : 'syncDisabled',
		color: offer.value.autoSync ? 'var(--color-success)' : 'var(--color-error)',
		cursor: 'pointer',
	} as const
})

// METHODS
async function toggleAutoSync() {
	offer.value.autoSync = !offer.value.autoSync
	await bulkyIdb.putShopOffer(offer.value)

	if (showAutoSyncTooltip.value === true) return

	showAutoSyncTooltip.value = true
	setTimeout(() => {
		showAutoSyncTooltip.value = false
	}, 2000)
}

function refreshOffer(uuid: BulkyShopOffer['uuid']) {
	shopStore.refreshOffer(uuid, refreshState)
}
</script>

<style scoped>
.m-shop-offer {
	display: grid;
	width: max-content;
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
