<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>Shop Settings</h2>
		</header>
		<main class="main">
			<div class="icon-grid">
				<LabelWithNumberInput v-model="configStore.config.shop.autoUploadPriceFloor" :input-props="{ min: 50, step: 1 }">
					Auto Upload Price Floor:
				</LabelWithNumberInput>
				<img src="/src/assets/png-icons/currency-chaos.png" height="32" width="32" decoding="async" loading="lazy" />
			</div>
			<div class="icon-grid">
				<LabelWithNumberInput v-model="configStore.config.shop.defaultMinBuyout" :input-props="{ min: 0, step: 1 }">
					Default Min Buyout:
				</LabelWithNumberInput>
				<img src="/src/assets/png-icons/currency-chaos.png" height="32" width="32" decoding="async" loading="lazy" />
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithNumberInput from '../molecules/LabelWithNumberInput.vue'

// STORES
const configStore = useConfigStore()
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	column-gap: 2rem;
	row-gap: 0.5rem;
	margin-left: 1rem;
}

.loading {
	display: grid;
	grid-column: span 2;
	justify-items: center;
	margin-top: 12rem;
	gap: 1.5rem;
}

.icon-grid {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 3;
	column-gap: 1rem;
}
</style>
