<template>
	<div class="a-input-number gradient-border" data-b-override :class="{ disabled }" @mouseleave="emit('mouseleave')">
		<div
			class="arrow-container next-container"
			@mousedown="e => onMousedown(e, 'add')"
			@mouseup="clearRepeatEvent"
			@mouseleave="clearRepeatEvent"
			@click.stop="clearSelection">
			<SvgIconAtom name="arrow-forward" :use-gradient="true"></SvgIconAtom>
		</div>
		<div
			class="arrow-container prev-container"
			@mousedown="e => onMousedown(e, 'subtract')"
			@mouseup="clearRepeatEvent"
			@mouseleave="clearRepeatEvent"
			@click.stop="clearSelection">
			<SvgIconAtom name="arrow-back" :use-gradient="true"></SvgIconAtom>
		</div>
		<div class="value-container">
			<input
				:id="id"
				ref="numberInputEl"
				type="number"
				:value="roundedValue"
				:disabled="disabled"
				:min="min"
				:max="max"
				:step="step"
				@input="onInput"
				@change="onChange"
				@click.stop="" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SvgIconAtom from './SvgIconAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { ButtonBackgroundColorScheme, Uuid } from '@shared/types/utility.types'

const numberInputEl = ref<HTMLInputElement>()
let fireInterval: NodeJS.Timeout | null = null
let fireTimeout: NodeJS.Timeout | null = null

// PROPS
const props = withDefaults(
	defineProps<{
		modelValue: number
		id?: Uuid
		min?: number
		max?: number
		step?: number
		numDigits?: number
		backgroundColor?: ButtonBackgroundColorScheme
		disabled?: boolean
		intervalFiringTimer?: number
	}>(),
	{
		id: BULKY_UUID.generateTypedUuid(),
		disabled: false,
		step: 1,
		intervalFiringTimer: 50,
		numDigits: 0,
		min: 0,
		max: 999,
		backgroundColor: 'dark',
	}
)

// EMITS
const emit = defineEmits<{
	'update:modelValue': [value: number]
	'change:modelValue': []
	mouseleave: []
}>()

// GETTERS

/**
 * Compute the allowed number of digits after the decimal point.
 * Has to be at least the number of digits of the 'step' prop.
 */
const allowedNumDigits = computed(() => {
	const numDigitsInStepProp = props.step % 1 ? props.step.toString().split('.')[1].length : 0
	return Math.max(props.numDigits, numDigitsInStepProp)
})

/** compute the background color for this component */
const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

/** the value being displayed in the input element */
const roundedValue = computed(
	() => Math.round(props.modelValue * Math.pow(10, allowedNumDigits.value)) / Math.pow(10, allowedNumDigits.value)
)

/** compute the base input width depending on how long the number is */
const inputWidth = computed(() => {
	// cast the rounded value to a string, remove decimal point, take the length and return that as css unit
	return `${(roundedValue.value + '').replace('.', '').length + 2}ch`
})

// METHODS

/** clears the current selection */
function clearSelection() {
	const selection = document.getSelection()
	if (selection) {
		selection.empty()
	} else if (window.getSelection) {
		const sel = window.getSelection()
		sel && sel.removeAllRanges()
	}
}

/**
 * handle different sort of input events
 * events can be triggered by typing in a new number manually
 * or by clicking on the arrows
 */
function onInput(event: Event, operator?: string) {
	const target = event.target
	if (target instanceof HTMLInputElement) {
		if (target.value === '') return
		const newValue = assertAllowedNumber(parseFloat(target.value))
		target.value = newValue.toString()
		emit('update:modelValue', newValue)
	} else {
		const step = parseFloat(numberInputEl.value?.attributes.getNamedItem('step')?.value ?? '1')

		let newValue = props.modelValue
		newValue = operator === 'add' ? newValue + step : newValue - step
		newValue = assertAllowedNumber(newValue)
		emit('update:modelValue', newValue)
	}
}

/** clamps the number input between the passed prop values */
function assertAllowedNumber(n: number) {
	// float
	if (n % 1 !== 0) {
		n = Math.round(n * Math.pow(10, allowedNumDigits.value)) / Math.pow(10, allowedNumDigits.value)
	}
	return n > props.max ? props.max : n < props.min ? props.min : n
}

/**
 * emit on a change event
 */
function onChange() {
	emit('change:modelValue')
}

/**
 * adds an interval function with a delay for repeated events on mousedown
 */
function onMousedown(event: Event, operator: 'add' | 'subtract') {
	console.log('mousing down')
	onInput(event, operator)
	fireTimeout = setTimeout(() => {
		fireInterval = setInterval(onInput.bind(null, event, operator), props.intervalFiringTimer)
	}, 250)
}

/**
 * clear all potentially existing fire intervals and timeouts
 */
function clearRepeatEvent() {
	if (fireInterval) {
		clearInterval(fireInterval)
	}
	if (fireTimeout) {
		clearTimeout(fireTimeout)
	}
}
</script>

<style scoped>
.a-input-number {
	--border-radius: var(--border-radius-small);
	--input-width: v-bind(inputWidth);
	--transition-duration: 0.2s;

	/* width: calc(9ch + 40px); */
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 2rem;
	width: var(--input-width);
	background-image: v-bind(backgroundColorButton);
	border-radius: var(--border-radius);
	transition: all 0.25s ease;
}

.a-input-number:hover {
	width: max(var(--input-width) + 30px, 3ch + 30px);
}

.a-input-number:hover::before {
	--show-border: 1;
}

.arrow-container {
	position: absolute;
	display: flex;
	align-items: center;
	height: 100%;
	width: max-content;
	cursor: pointer;
	opacity: 0;
	transition: all 0.25s ease;
}

.next-container {
	right: -5px;
}

.a-input-number:hover .next-container {
	opacity: 1;
	transform: translateX(-5px);
}

.prev-container {
	left: -5px;
}

.a-input-number:hover .prev-container {
	opacity: 1;
	transform: translateX(5px);
}

.value-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}

input[type='number'] {
	-moz-appearance: textfield;
	appearance: textfield;
}

input {
	text-align: center;
	line-height: 0.8rem;
	font-size: 0.8rem;
	font-weight: 700;
	height: 100%;
	width: 100%;
	background-color: transparent;
	outline: none;
	border: none;
	color: inherit;
}

input:focus {
	outline: none;
}
</style>
