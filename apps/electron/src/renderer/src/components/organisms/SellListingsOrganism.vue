<template>
	<ul class="o-sell-listings flow">
		<TransitionAtom group v-on="hooks">
			<FallbackSellListingMolecule v-if="listings.length === 0" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import FallbackSellListingMolecule from '../molecules/fallbacks/FallbackSellListingMolecule.vue'

const listings = []

const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.45,
})
</script>

<style scoped></style>
