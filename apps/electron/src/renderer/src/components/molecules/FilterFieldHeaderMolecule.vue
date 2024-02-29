<template>
	<div class="a-filter-field-header no-select">
		<div class="main">{{ mainOptionName }}</div>
		<div class="secondary" v-if="secondaryOptionName">{{ secondaryOptionName }}</div>
		<div class="amount">Amount</div>
		<!-- <div class="buyout">
			<img src="/src/assets/png-icons/currency-chaos.png" decoding="async" loading="lazy" />
		</div> -->
	</div>
</template>

<script setup lang="ts">
defineProps<{
	mainOptionName: string
	secondaryOptionName?: string
}>()
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.a-filter-field-header {
	/* display: grid;
	grid-template-columns: subgrid;
	grid-column: span 4; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: 2fr 1fr min(7ch) 1.5rem;
	gap: 0.5rem;
}

.amount {
	place-self: center;
}

.buyout {
	place-self: center;

	img {
		height: 1.5rem;
	}
}
</style>
