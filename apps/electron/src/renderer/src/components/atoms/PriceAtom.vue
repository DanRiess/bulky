<template>
	<div class="a-total-price no-select">
		<div class="label">{{ label }}</div>
		<div class="currency-section" :class="{ hide: price.divine === 0 }">
			{{ price.divine }}
			<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
		<div class="currency-section" :class="{ hide: price.chaos === 0 }">
			{{ price.chaos }}
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { TotalPrice } from '@shared/types/bulky.types'
import { computed } from 'vue'

// PROPS
const props = withDefaults(
	defineProps<{
		price: TotalPrice
		label?: string
	}>(),
	{
		label: 'Total Price:',
	}
)

defineSlots()

// GETTERS
const templateColumns = computed(() => {
	if (props.price.divine === 0) {
		return 'auto 0fr 1fr'
	} else if (props.price.chaos === 0) {
		return 'auto 1fr fit-content(0px)'
	}
	return 'auto 1fr fit-content(50px)'
})
</script>

<style scoped>
.a-total-price {
	display: grid;
	grid-template-columns: v-bind(templateColumns);
	gap: 0.5rem;
	transition: 300ms ease;
	width: max-content;
}

.currency-section {
	display: flex;
	text-wrap: nowrap;
	gap: 0.1rem;
	transition: 500ms;
	min-width: 0;
	overflow: hidden;
}
</style>
