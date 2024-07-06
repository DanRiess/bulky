<template>
	<div class="a-input-select" :class="{ 'input-active': inputActive, 'combo-active': comboboxActive }" ref="selectEl">
		<InputTextAtom
			:id="id"
			v-model="query"
			:placeholder="model.size + ' selected'"
			:max-width="maxWidth"
			:background-color="backgroundColor"
			@update:modelValue="activeOptionIdx = 0"
			@click="onInputFocus"
			@keyup.enter="onInputKeyEnter" />
		<div class="transition-wrapper gradient-border" :class="{ 'is-open': inputActive }" data-b-override ref="wrapperEl">
			<ul class="combobox expandable-content">
				<ListItemComboboxAtom
					v-for="(listItem, idx) in filteredOptions"
					:key="listItem.optionValue"
					v-model="filteredOptions[idx]"
					:hovered="false"
					:active="model.has(listItem.optionValue)"
					@mouseenter="activeOptionIdx = idx"
					@update:model-value="(e: SelectOption<T>) => setModelValue(e.optionValue)" />
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T extends string">
import { computed, onMounted, ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import ListItemComboboxAtom, { SelectOption } from './ListItemComboboxAtom.vue'
import InputTextAtom from './InputTextAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { ButtonBackgroundColorScheme, Uuid } from '@shared/types/utility.types'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { Category } from '@shared/types/bulky.types'

// MODEL

/**
 * This is not the model that is used in the input.
 * It will only be changed after the input model has been validated.
 * The reason for this is to avoid invalid values, since the input query can and should be literally any string.
 * This model however should only emit valid values.
 */
const model = defineModel<Set<T>>({ required: true })

// PROPS
const props = withDefaults(
	defineProps<{
		id?: Uuid
		category: Category
		options: T[]
		maxWidth?: number
		backgroundColor?: ButtonBackgroundColorScheme
	}>(),
	{
		id: BULKY_UUID.generateTypedUuid(),
		maxWidth: 130,
		backgroundColor: 'dark',
	}
)

// HTML REF ELEMENTS
const selectEl = ref<HTMLElement | null>(null)
const wrapperEl = ref<HTMLElement | null>(null)

// STATE
const query = ref('')
const inputActive = ref(false)
const comboboxActive = computed(() => inputActive.value && filteredOptions.value.length > 0)
const activeOptionIdx = ref(0)

// GETTERS

const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

/**
 * Sanitizes the prop option types into something displayable.
 * In this case, removes the uppercase and capitalizes the string.
 */
const computedOptions = computed<SelectOption<T>[]>(() => {
	// return props.options.map(option => {
	// 	return BULKY_TRANSFORM.stringToDisplayValue(option)
	// })
	return props.options.map(option => {
		return {
			optionValue: option,
			displayValue: BULKY_TRANSFORM.stringToDisplayValue(option),
		}
	})
})

/** Filters the available options by matching them against the current regex query. */
const filteredOptions = computed(() => {
	console.log(computedOptions.value)
	return computedOptions.value
		.map(option => {
			// if (option.displayValue === query.value) return undefined
			// if (option.displayValue.match(queryRegex.value)) {
			// 	return option
			// }
			// return undefined
			return option
		})
		.filter(Boolean)
})

// EVENTS

/** Clicking outside the combobox triggers the same action as pressing Enter. */
onClickOutside(selectEl, () => {
	inputActive.value = false
})

/** Arrow up action for the combobox. Chooses the previous option. */
onKeyStroke(
	'ArrowUp',
	e => {
		e.preventDefault()
		activeOptionIdx.value = activeOptionIdx.value > 0 ? activeOptionIdx.value - 1 : 0
	},
	{ target: selectEl }
)

/** Arrow down action for the combobox. Chooses the next option. */
onKeyStroke(
	'ArrowDown',
	e => {
		e.preventDefault()
		activeOptionIdx.value =
			activeOptionIdx.value < filteredOptions.value.length - 1
				? activeOptionIdx.value + 1
				: filteredOptions.value.length - 1
	},
	{ target: selectEl }
)

// METHODS

/** Activate the input and reset the current query. Do not change the model value here. */
function onInputFocus() {
	console.log('input foc')
	// find the index of the current query value
	activeOptionIdx.value = computedOptions.value.findIndex(computedName => computedName.displayValue === query.value)

	inputActive.value = !inputActive.value
	// if (inputActive.value) {
	// 	query.value = ''
	// }
}

/**
 * Deactivate the input and select the entry from the options that matches the current query the most.
 * If the query doesn't match any entries, reset it to the first value. Change the model value here.
 */
function onInputKeyEnter() {
	if (inputActive.value === false) return

	const option = computedOptions.value.find(option => option.displayValue === query.value)
	if (option) {
		setModelValue(option.optionValue)
	}
}

/**
 * Mini helper to not set the value manually in different functions.
 * props.options is an array of the actual type.
 * computedOptionNames is the sanitized value that is visible in the input (mostly no capslock).
 * The model should refer to the actual type though.
 */
function setModelValue(value: T) {
	model.value.has(value) ? model.value.delete(value) : model.value.add(value)
	setQueryValue()
}

function setQueryValue() {
	const arr: string[] = []
	model.value.forEach(value => arr.push(BULKY_TRANSFORM.stringToDisplayValue(value)))
	query.value = arr.sort().join(', ')
}

// HOOKS
onMounted(() => {
	setQueryValue()
})
</script>

<style scoped>
.a-input-select {
	position: relative;
}

.a-input-select.combo-active .transition-wrapper::before,
.a-input-select:hover .a-input-text,
.a-input-select.input-active .a-input-text {
	--show-border: 1;
}

.transition-wrapper {
	display: grid;
	grid-template-rows: 0fr;
	position: absolute !important;
	width: 100%;
	min-width: max-content;
	left: 0;
	background-image: v-bind(backgroundColorButton);
	border-radius: var(--border-radius-small);
	transition: grid-template-rows 0.25s ease-out;
	z-index: 500;
}

.transition-wrapper.is-open {
	grid-template-rows: 1fr;
}

.combobox {
	padding: 0 0.35rem;
	overflow: auto;
	max-height: 250px;
}
</style>
