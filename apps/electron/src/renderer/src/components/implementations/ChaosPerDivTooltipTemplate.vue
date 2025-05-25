<template>
	<div class="t-chaos-per-div-tooltip">
		<p v-for="n in 9" :key="n" class="fraction">
			<span>{{ ((10 - n) * 0.1).toFixed(1) }} D </span>
			<span>&longleftrightarrow;</span>
			<span>{{ Math.round(chaosPerDiv * (10 - n) * 0.1) }} C</span>
		</p>
	</div>
</template>

<script setup lang="ts">
import { useNinjaStore } from '@web/stores/ninjaStore'

// STORES
const ninjaStore = useNinjaStore()

// STATE
const { chaosPerDiv } = ninjaStore
</script>

<style scoped>
.t-chaos-per-div-tooltip {
	display: grid;
	grid-template-columns: max-content 3ch max-content;
}

.fraction {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 3;
}

span {
	text-align: center;
}
</style>
