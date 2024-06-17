<template>
	<div class="o-shop-offers">
		<FallbackShopOfferMolecule v-if="shopStore.offers.length === 0" />
		<ShopOfferMolecule v-for="(_, idx) in shopStore.offers" v-model="shopStore.offers[idx]" />
	</div>
</template>

<script setup lang="ts">
import FallbackShopOfferMolecule from '../molecules/fallbacks/FallbackShopOfferMolecule.vue'
import { useShopStore } from '@web/stores/shopStore'
import ShopOfferMolecule from '../molecules/ShopOfferMolecule.vue'

// STORES
const shopStore = useShopStore()
</script>

<style scoped>
.o-shop-offers {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	transform-origin: left;
	max-height: calc(100% - 6rem);
	overflow: auto;
	scrollbar-gutter: stable;
}
</style>
