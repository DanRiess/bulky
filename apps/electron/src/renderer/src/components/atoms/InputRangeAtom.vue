<template>
	<input
		type="range"
		class="a-range-input"
		:id="id"
		:min="min"
		:max="max"
		:step="step"
		:disabled="disabled"
		v-model.number="model" />
</template>

<script setup lang="ts">
import { Uuid } from '@shared/types/utility.types'

const model = defineModel<number>({ required: true })

withDefaults(
	defineProps<{
		id?: Uuid
		min?: number
		max?: number
		step?: number
		disabled?: boolean
	}>(),
	{
		min: 0,
		max: 2,
		step: 1,
		disabled: false,
	}
)
</script>

<style scoped>
.a-range-input {
	-webkit-appearance: none;
	appearance: none;
	background: transparent;
	cursor: pointer;
	/* width: 10rem; */
}

.a-range-input::-webkit-slider-runnable-track {
	background: linear-gradient(90deg, var(--color-blue-bright), var(--color-purple-bright));
	border-radius: 1000vw;
	height: 0.25rem;
}

.a-range-input::-webkit-slider-thumb {
	-webkit-appearance: none; /* Override default look */
	appearance: none;
	margin-top: -6px; /* Centers thumb on the track */
	background-color: var(--color-blue-bright);
	height: 1rem;
	width: 0.5rem;
	border-radius: 1000vw;
}

.a-range-input:disabled {
	opacity: 0.5;
}
</style>
