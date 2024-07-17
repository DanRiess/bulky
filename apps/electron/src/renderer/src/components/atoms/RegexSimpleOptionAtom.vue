<template>
	<li class="regex-option">
		<div class="selected">
			<InputCheckboxAtom v-model="model.available" @update:model-value="emit('updateOverrideValue')" />
		</div>
		<div class="explanation" :class="{ disabled: !model.available }">
			<slot />
		</div>
		<div :class="{ disabled: !model.available }">add</div>
		<div class="additional-price" :class="{ disabled: !model.available }">
			<InputNumberAtom v-model="model.addedPrice" @update:model-value="emit('updateOverrideValue')" />
		</div>
		<div class="chaos" :class="{ disabled: !model.available }">
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
	</li>
</template>

<script setup lang="ts">
import InputCheckboxAtom from './InputCheckboxAtom.vue'
import InputNumberAtom from './InputNumberAtom.vue'
import { RegexSimplePriceFragment } from '@web/categories/map/map.types'

// MODEL
const model = defineModel<RegexSimplePriceFragment>({ required: true })

// EMITS
const emit = defineEmits<{
	updateOverrideValue: []
}>()
</script>

<style scoped>
.regex-option {
	position: relative;
	margin-left: 2.5rem;
	height: 2rem;
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
}

.regex-option::before {
	content: '';
	position: absolute;
	padding-top: 2rem;
	margin-top: -2rem;
	left: -1.5rem;
	top: 0;
	bottom: 0;
	transform: translateY(-25%);
	width: 1rem;
	border-left: 1px solid white;
	border-bottom: 1px solid white;
}

.explanation {
	display: grid;
	grid-column: span 2;
}

.additional-price {
	display: flex;
	justify-content: center;
}

.disabled {
	text-decoration: line-through;
}
</style>
