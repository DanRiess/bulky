<template>
	<div class="m-shop-offer flow animated-gradient-background" data-b-override>
		<section class="title-section">
			<img :src="imgSource" decoding="async" loading="lazy" /> &ndash;
			<PriceAtom label="Value:" :price="offer.fullPrice" />
		</section>
		<ShopOfferItemCollectionMolecule :items="offer.items" />
		<ShopOfferConfigMolecule :offer="offer" />
		<section class="footer-section">
			<div class="info-toggles">
				Active
				<div>&ndash;</div>
				<SvgIconAtom name="syncDisabled" />
			</div>
			<div class="actions">
				<SvgButtonWithPopupMolecule
					:svg-props="{
						name: 'refresh',
						rotate: testRequestPendingState,
						useGradient: testRequestPendingState,
					}"
					:tooltip-props="tooltipProps"
					background-color="dark"
					>Refresh Offer</SvgButtonWithPopupMolecule
				>

				<SvgButtonWithPopupMolecule :svg-props="{ name: 'edit' }" :tooltip-props="tooltipProps" background-color="dark">
					Edit Offer
				</SvgButtonWithPopupMolecule>

				<SvgButtonWithPopupMolecule :svg-props="{ name: 'trash' }" :tooltip-props="tooltipProps" background-color="dark">
					Delete Offer
				</SvgButtonWithPopupMolecule>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { BulkyOffer } from '@shared/types/bulky.types'
import { computed, ref } from 'vue'
import PriceAtom from '../atoms/PriceAtom.vue'
import ShopOfferItemCollectionMolecule from './ShopOfferItemCollectionMolecule.vue'
import ShopOfferConfigMolecule from './ShopOfferConfigMolecule.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import { TooltipPropsWithoutActive } from '../atoms/ButtonTooltipAtom.vue'

// PROPS
const props = defineProps<{
	offer: BulkyOffer
}>()

// STATE
const testRequestPendingState = ref(true)

// GETTERS
const imgSource = computed(() => {
	if (props.offer.category === 'ESSENCE') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9IYXRyZWQ3Iiwic2NhbGUiOjF9XQ/a69c5c06cc/Hatred7.png'
	} else if (props.offer.category === 'SCARAB') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQnJlYWNoIiwic2NhbGUiOjF9XQ/b129897f73/GreaterScarabBreach.png'
	}
	return ''
})

const tooltipProps: TooltipPropsWithoutActive = {
	position: 'top',
	transitionDirection: 'toTop',
	popupAlignment: 'left',
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
	height: 1.5rem;
	gap: 0.5rem;
}

.footer-section {
	display: flex;
	justify-content: space-between;
}

.info-toggles {
	display: flex;
	height: 1.5rem;
	gap: 0.5rem;
}

.actions {
	display: flex;
	gap: 0.5rem;
}
</style>
