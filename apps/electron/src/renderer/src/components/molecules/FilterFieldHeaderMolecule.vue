<template>
	<div class="a-filter-field-header no-select">
		<div class="main">{{ mainOptionName }}</div>
		<div class="secondary" v-show="secondaryOptionName">{{ secondaryOptionName }}</div>
		<div class="quantity" v-show="!alwaysMaxQuantity">Quantity</div>
		<!-- <div class="buyout">
			<img src="/src/assets/png-icons/currency-chaos.png" decoding="async" loading="lazy" />
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	mainOptionName: string
	secondaryOptionName?: string
	alwaysMaxQuantity: boolean
}>()

const gridTemplateColumns = computed(() => {
	const secondary = props.secondaryOptionName ? '1fr' : '0'
	const quant = props.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${secondary} ${quant} 1.5rem`
})
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.a-filter-field-header {
	/* display: grid;
	grid-template-columns: subgrid;
	grid-column: span 4; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.5rem;
	transition: grid-template-columns 0.25s ease;
}

.quantity {
	place-self: center;
}

.buyout {
	place-self: center;

	img {
		height: 1.5rem;
	}
}
</style>
