<template>
	<div class="o-shop-offers flow animated-gradient-background" data-b-override>
		<ul class="">
			<TransitionAtom group v-on="hooks">
				<FallbackShopOfferMolecule v-if="shopStore.offers.length === 0" />
				<ShopOfferMolecule v-for="offer in shopStore.offers" :offer="offer" />
			</TransitionAtom>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import FallbackShopOfferMolecule from '../molecules/fallbacks/FallbackShopOfferMolecule.vue'
import { useShopStore } from '@web/stores/shopStore'
import ShopOfferMolecule from '../molecules/ShopOfferMolecule.vue'

// STORES
const shopStore = useShopStore()

// STATE
console.log(shopStore.offers)

// HOOKS
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.45,
})
</script>

<style scoped>
.o-shop-offers {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
	display: grid;
	gap: 1rem;
	transform-origin: left;
}
</style>
