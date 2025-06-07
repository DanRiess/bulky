<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>Shop Settings</h2>
		</header>
		<main class="main">
			<LabelAtom id="auto-upload-price-floor">Auto Upload Price Floor:</LabelAtom>
			<div class="input-with-icon">
				<InputNumberAtom v-model="autoUploadPriceFloor" :input-props="{ step: 1 }" />
				<img
					class="no-select"
					src="/src/assets/png-icons/currency-chaos.png"
					height="32"
					width="32"
					decoding="async"
					loading="lazy" />
			</div>
			<LabelAtom id="min-buyout">Default Min Buyout:</LabelAtom>
			<div class="inputs-with-icons">
				<div class="input-with-icon">
					<InputNumberAtom v-model="divine" :input-props="{ step: 1 }" />
					<img
						class="no-select"
						src="/src/assets/png-icons/currency-divine.png"
						height="32"
						width="32"
						decoding="async"
						loading="lazy" />
				</div>
				<div class="input-with-icon">
					<InputNumberAtom v-model="chaos" :min="0" :step="1" />
					<img
						class="no-select"
						src="/src/assets/png-icons/currency-chaos.png"
						height="32"
						width="32"
						decoding="async"
						loading="lazy" />
				</div>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import { computed } from 'vue'
import LabelAtom from '../atoms/LabelAtom.vue'

// STORES
const configStore = useConfigStore()

// GETTERS
const divine = computed({
	get() {
		return configStore.config.shop.defaultMinBuyout.divine
	},
	set(value) {
		configStore.updateAndValidateConfig({ shop: { defaultMinBuyout: { divine: value } } })
	},
})

const chaos = computed({
	get() {
		return configStore.config.shop.defaultMinBuyout.chaos
	},
	set(value) {
		configStore.updateAndValidateConfig({ shop: { defaultMinBuyout: { chaos: value } } })
	},
})

const autoUploadPriceFloor = computed({
	get() {
		return configStore.config.shop.autoUploadPriceFloor
	},
	set(value) {
		configStore.updateAndValidateConfig({ shop: { autoUploadPriceFloor: value } })
	},
})
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	grid-auto-rows: minmax(2rem, max-content);
	column-gap: 1rem;
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

.inputs-with-icons {
	display: flex;
	gap: 1.5rem;
}

.input-with-icon {
	display: flex;
	gap: 0.5rem;
}
</style>
