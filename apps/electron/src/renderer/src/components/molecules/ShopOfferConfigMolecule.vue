<template>
	<div class="m-shop-offer-config animated-gradient-background" data-b-override>
		<LabelWithTextMolecule v-model="testText" placeholder="Enter your IGN">IGN</LabelWithTextMolecule>
		<LabelWithRangeMolecule v-model="test" :max="2" :step="0.05">Price Multiplier</LabelWithRangeMolecule>
		<LabelWithCheckboxMolecule v-model="testCheckbox">Only Full Buyout</LabelWithCheckboxMolecule>
		<MinBuyoutAtom v-model:chaos="testChaos" v-model:divine="testDiv" :disabled="testCheckbox">Min. Buyout</MinBuyoutAtom>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LabelWithRangeMolecule from './LabelWithRangeMolecule.vue'
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import LabelWithTextMolecule from './LabelWithTextMolecule.vue'
import MinBuyoutAtom from '../atoms/MinBuyoutAtom.vue'

const test = ref(1)
const testCheckbox = ref(false)
const testText = ref('')
const testChaos = ref(0)
const testDiv = ref(0)
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
