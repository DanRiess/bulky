<template>
	<div class="a-total-price no-select" :style="style">
		<div class="label" v-if="label">{{ props.label }}</div>
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

// GETTERS
const templateColumns = computed(() => {
	const labelArea = props.label !== '' ? 'auto' : ''
	if (props.price.divine === 0) {
		return `${labelArea} 0fr 1fr`
	} else if (props.price.chaos === 0) {
		return `${labelArea} 1fr fit-content(0px)`
	}
	return `${labelArea} 1fr fit-content(50px)`
})

const gap = computed(() => {
	// No gap if there is only one value displayed.
	if (!props.label && (props.price.divine === 0 || props.price.chaos === 0)) return '0'
	// Half the gap if divine is 0, because the column is still there, so we get 2 gaps between label and chaos
	else if (props.label && props.price.divine === 0) return '0.25rem'
	else return '0.5rem'
})

const style = computed(() => {
	return {
		gridTemplateColumns: templateColumns.value,
		columnGap: gap.value,
	}
})
</script>

<style scoped>
.a-total-price {
	display: grid;
	/* grid-template-columns: v-bind(templateColumns);
	column-gap: v-bind(gap); */
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
