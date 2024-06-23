<template>
	<div class="m-bazaar-offer-metadata flow">
		<div class="ign">IGN: {{ offer.ign }}</div>
		<ChaosPerDivAtom :chaos-per-div="offer.chaosPerDiv" />
		<div class="multiplier no-select">Multiplier: {{ offer.multiplier * 100 }} %</div>
		<PriceAtom label="Min Price:" :price="price" />
	</div>
</template>

<script setup lang="ts">
import { BulkyBazaarOffer } from '@shared/types/bulky.types'
import ChaosPerDivAtom from '../atoms/ChaosPerDivAtom.vue'
import PriceAtom from '../atoms/PriceAtom.vue'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'

// PROPS
const props = defineProps<{
	offer: BulkyBazaarOffer
}>()

// GETTERS
const price = useChaosToDiv(props.offer.minimumBuyout, props.offer.chaosPerDiv)
</script>

<style scoped>
.m-bazaar-offer-metadata {
	--flow-space: 0.2em;
}

.ign {
	text-wrap: nowrap;
	overflow: hidden;
}
</style>
