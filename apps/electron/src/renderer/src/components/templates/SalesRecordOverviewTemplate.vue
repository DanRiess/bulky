<template>
	<main class="t-sales-record-overview">
		<header class="title">
			<h1 class="no-select">My Sales Records</h1>
		</header>
		<SellListingsOrganism />
	</main>
</template>

<script setup lang="ts">
import SellListingsOrganism from '../organisms/SellListingsOrganism.vue'
</script>

<style scoped>
.t-sales-record-overview {
	margin-top: 1rem;
	transform-origin: top;
}

.title {
	height: 2rem;
}
</style>
