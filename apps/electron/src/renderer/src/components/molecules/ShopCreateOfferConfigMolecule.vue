<template>
	<div class="m-shop-offer-config animated-gradient-background" data-b-override>
		<LabelWithTextMolecule v-model="ignModel" placeholder="Enter your IGN">IGN</LabelWithTextMolecule>
		<LabelWithRangeMolecule v-if="multiplierModel" v-model="multiplierModel" :max="2" :step="0.05">
			Price Multiplier
		</LabelWithRangeMolecule>
		<LabelWithCheckboxMolecule v-if="fullBuyoutModel !== undefined" v-model="fullBuyoutModel">
			Only Full Buyout
		</LabelWithCheckboxMolecule>
		<MinBuyoutAtom v-model:chaos="minBuyoutModel.chaos" v-model:divine="minBuyoutModel.divine" :disabled="fullBuyoutModel">
			Min. Buyout
		</MinBuyoutAtom>
	</div>
</template>

<script setup lang="ts">
import LabelWithRangeMolecule from './LabelWithRangeMolecule.vue'
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import LabelWithTextMolecule from './LabelWithTextMolecule.vue'
import MinBuyoutAtom from '../atoms/MinBuyoutAtom.vue'

// MODELS
const ignModel = defineModel<string>('ign', { required: true })
const multiplierModel = defineModel<number>('multiplier')
const fullBuyoutModel = defineModel<boolean>('fullBuyout')
const minBuyoutModel = defineModel<{ chaos: number; divine: number }>('minBuyout', { required: true })
</script>

<style scoped>
.m-shop-offer-config {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
	padding: 1rem;
	border-radius: var(--border-radius-medium);
}
</style>
