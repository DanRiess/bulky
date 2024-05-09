<template>
	<div class="a-bazaar-offer-current-price">
		<div>Total:</div>
		<div class="total">
			<div class="price-fragment divine" v-if="totalPrice.divine > 0">
				{{ totalPrice.divine }}
				<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
			</div>
			<div class="price-fragment chaos" v-if="totalPrice.chaos > 0">
				{{ totalPrice.chaos }}
				<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { TotalPrice } from '@shared/types/bulky.types'

// PROPS
defineProps<{
	totalPrice: TotalPrice
}>()
</script>

<style scoped>
.a-bazaar-offer-current-price {
	display: grid;
	grid-template-columns: 1fr max-content max-content;
	margin-top: 0.5rem;
	margin-right: 0.2rem; /* for some reason, there is a gap at the end of the item list grid. mirror that. */
}

.total {
	height: 1.6em;
	display: grid;
	grid-template-columns: subgrid;
	gap: 0.5rem;
	grid-column: span 2;
}

.chaos {
	display: grid;
	grid-template-columns: auto 24px;
	grid-column: 3/4;
	text-align: end;
	gap: 0.35rem;
}

.divine {
	display: grid;
	grid-template-columns: auto auto;
	justify-content: end;
	gap: 0.25rem;
}
</style>
