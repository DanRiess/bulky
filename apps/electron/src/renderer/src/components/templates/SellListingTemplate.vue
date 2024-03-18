<template>
	<main class="t-sell-listings">
		<header class="title">
			<h1 class="no-select">My Listings</h1>
		</header>
		<SellListingsOrganism />
	</main>
</template>

<script setup lang="ts">
import SellListingsOrganism from '../organisms/SellListingsOrganism.vue'
</script>

<style scoped>
.t-sell-listings {
	margin-top: 1rem;
	transform-origin: top;
}

.title {
	height: 2rem;
}
</style>
