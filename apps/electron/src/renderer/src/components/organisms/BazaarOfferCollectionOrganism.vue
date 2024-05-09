<template>
	<ul class="o-listing flow">
		<TransitionAtom group v-on="hooks">
			<FallbackBazaarOfferMolecule v-if="offers.length === 0" />
			<BazaarOfferOrganism v-for="(offer, idx) in offers" :key="offer.uuid" :computed-offer="offer" :data-index="idx" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import FallbackBazaarOfferMolecule from '../molecules/fallbacks/FallbackBazaarOfferMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import { ComputedOfferDisplayValues } from '@shared/types/bulky.types'
import BazaarOfferOrganism from './BazaarOfferOrganism.vue'

//PROPS
defineProps<{
	offers: ComputedOfferDisplayValues[]
}>()

// COMPOSABLES
const hooks = useListTransition()
</script>

<style scoped>
.o-listing {
	overflow: auto;
	border-radius: var(--border-radius-small);
	padding-right: 0.2rem;
}

.o-listing > .m-listing-item:not(:first-child) {
	margin-top: 1rem;
}
</style>
