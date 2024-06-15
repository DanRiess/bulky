<template>
	<div class="m-shop-offer-config">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3 @click="expanded = !expanded">Config</h3>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<div class="config">
				<div class="config-option multiplier">
					<label>Price Multiplier:</label>
					<div>{{ offer.multiplier * 100 }} %</div>
				</div>
				<div class="config-option full-buyout">
					<label>FullBuyout:</label>
					<SvgIconAtom :name="offer.fullBuyout ? 'done' : 'close'" />
				</div>
				<div class="config-option min-buyout" v-if="!offer.fullBuyout">
					<label>Min Buyout:</label>
					<div class="min-buyout-value">
						<div class="currency-section" v-if="Math.floor(offer.minimumBuyout / offer.chaosPerDiv) > 0">
							{{ Math.floor(offer.minimumBuyout / offer.chaosPerDiv) }}
							<img
								src="/src/assets/png-icons/currency-divine.png"
								height="24"
								width="24"
								decoding="async"
								loading="lazy" />
						</div>
						<div
							class="currency-section"
							v-if="
								Math.floor(offer.minimumBuyout % offer.chaosPerDiv) > 0 ||
								Math.floor(offer.minimumBuyout / offer.chaosPerDiv) === 0
							">
							{{ offer.minimumBuyout % offer.chaosPerDiv }}
							<img
								src="/src/assets/png-icons/currency-chaos.png"
								height="24"
								width="24"
								decoding="async"
								loading="lazy" />
						</div>
					</div>
				</div>
			</div>
		</AccordionTransitionWrapperAtom>
	</div>
</template>

<script setup lang="ts">
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { ref } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import { BulkyOffer } from '@shared/types/bulky.types'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// PROPS
defineProps<{
	offer: BulkyOffer
}>()

// STATE
const expanded = ref(false)
</script>

<style scoped>
.config {
	display: grid;
	grid-template-columns: max-content 1fr;
	row-gap: 0.2rem;
	column-gap: 0.5rem;
	margin-top: 0.5rem;
}

.config-option {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 2;
	text-align: left;
	align-items: center;
	padding-left: 0.5rem;
}

.min-buyout-value,
.currency-section {
	display: flex;
	gap: 0.2rem;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
	text-align: left;
	cursor: pointer;
	user-select: none;
}
</style>
