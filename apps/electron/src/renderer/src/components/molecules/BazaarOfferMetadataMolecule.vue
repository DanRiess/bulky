<template>
	<div class="m-bazaar-offer-metadata flow">
		<div class="ign">IGN: {{ ign }}</div>
		<ChaosPerDivAtom :chaos-per-div="chaosPerDiv" />
		<div class="multiplier no-select">Multiplier: {{ multiplier * 100 }}%</div>
	</div>
</template>

<script setup lang="ts">
import ChaosPerDivAtom from '../atoms/ChaosPerDivAtom.vue'

defineProps<{
	ign: string
	chaosPerDiv: number
	multiplier: number
}>()
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
