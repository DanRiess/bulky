<template>
	<div class="o-sell-listings flow animated-gradient-background" data-b-override>
		<ul class="">
			<TransitionAtom group v-on="hooks">
				<FallbackShopOfferMolecule v-if="offers.length === 0" />
			</TransitionAtom>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import FallbackShopOfferMolecule from '../molecules/fallbacks/FallbackShopOfferMolecule.vue'

// STATE
const offers = []

// HOOKS
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.45,
})
</script>

<style scoped>
.o-sell-listings {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
	display: grid;
	gap: 1rem;
	transform-origin: left;
}
</style>
