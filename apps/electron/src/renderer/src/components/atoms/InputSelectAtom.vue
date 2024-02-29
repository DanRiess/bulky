<template>
	<div class="a-input-select" :class="{ 'input-active': inputActive, 'combo-active': comboboxActive }" ref="selectEl">
		<InputTextAtom
			:id="id"
			v-model="query"
			:placeholder="filteredOptions[activeOptionIdx]"
			:max-width="maxWidth"
			@update:modelValue="activeOptionIdx = 0"
			@focus="onInputFocus"
			@keyup.enter="onInputKeydownEnter" />
		<div class="transition-wrapper gradient-border" :class="inputActive && 'is-open'" data-b-override ref="wrapperEl">
			<ul class="combobox expandable-content">
				<ListItemComboboxAtom
					v-for="(listItem, idx) in filteredOptions"
					:key="listItem"
					:display-name="listItem"
					:hovered="idx === activeOptionIdx"
					@mouseenter="activeOptionIdx = idx"
					@click="onListItemClick" />
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T extends string">
import { computed, onMounted, ref, watch } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import ListItemComboboxAtom, { SelectableListItem } from './ListItemComboboxAtom.vue'
import InputTextAtom from './InputTextAtom.vue'
import { ButtonBackgroundColorScheme, Uuid } from '@web/types/utitlity.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { transformToDisplayValue } from '@web/utility/transformers'

// MODEL

/**
 * This is not the model that is used in the input.
 * It will only be changed after the input model has been validated.
 * The reason for this is to avoid invalid values, since the input query can and should be literally any string.
 * This model however should only emit valid values.
 */
const model = defineModel<T>()

// MODEL WATCHER

/** Triggered when the parent changes the model. I. e. when removing a filter field */
watch(model, model => {
	query.value = typeToDisplayName(model)
})

// PROPS
const props = withDefaults(
	defineProps<{
		id?: Uuid
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

// COMPUTEDS

const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

/**
 * Turns the query into a regex that matches characters anywhere.
 * i. e. query 'mirrdeli' will be turned into a regex that matches 'Mirror of Delirium'
 */
const queryRegex = computed(() => {
	if (!query.value) return new RegExp('', 'gi')
	const regexString = [...query.value].map(c => `${c}.*`).join('')
	return new RegExp(regexString, 'gi')
})

/**
 * Sanitizes the prop option types into something displayable.
 * In this case, removes the uppercase and capitalizes the string.
 */
const computedOptionNames = computed(() => {
	return props.options.map(option => {
		return transformToDisplayValue(option)
	})
})

/** Filters the available options by matching them against the current regex query. */
const filteredOptions = computed(() => {
	return computedOptionNames.value
		.map((option: string) => {
			if (option === query.value) return undefined
			if (option.match(queryRegex.value)) {
				return option
			}
			return undefined
		})
		.filter(Boolean)
})

// EVENTS

/** Clicking outside the combobox triggers the same action as pressing Enter. */
onClickOutside(selectEl, onInputKeydownEnter)

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
	// find the index of the current query value
	activeOptionIdx.value = Math.max(
		0,
		computedOptionNames.value.findIndex(computedName => computedName === query.value)
	)
	inputActive.value = true
	query.value = ''
}

/**
 * Deactivate the input and select the entry from the options that matches the current query the most.
 * If the query doesn't match any entries, reset it to the first value. Change the model value here.
 */
function onInputKeydownEnter() {
	if (inputActive.value === false) return

	inputActive.value = false
	if (filteredOptions.value[activeOptionIdx.value]) {
		query.value = filteredOptions.value[activeOptionIdx.value]
	} else {
		query.value = computedOptionNames.value[0]
	}

	const idx = computedOptionNames.value.findIndex(n => n === query.value)
	if (idx > -1) {
		setModelValue(idx)
	}
}

/** Deactivate the input and select the currently hovered options entry. Change the model value here as well. */
function onListItemClick(val: SelectableListItem['value']) {
	query.value = val.toString()
	if (query.value !== '') {
		setModelValue(activeOptionIdx.value)
	}
	inputActive.value = false
}

/**
 * Mini helper to not set the value manually in different functions.
 * props.options is an array of the actual type.
 * computedOptionNames is the sanitized value that is visible in the input (mostly no capslock).
 * The model should refer to the actual type though.
 */
function setModelValue(idx: number) {
	model.value = props.options[idx]
}

/** Given a typed variable, this function finds its corresponding display value in the computedNames array. */
function typeToDisplayName(type: T | undefined) {
	if (!type) return ''

	const transformedType = type.split('_').join(' ')

	const regex = new RegExp(transformedType, 'gi')
	return computedOptionNames.value.find(name => name.match(regex)) ?? ''
}

// HOOKS
onMounted(() => {
	// on mounted, the query value is set to the passed model value.
	// if this value doesn't match any options entries, reset both of them.
	if (!model.value || !props.options.includes(model.value)) {
		query.value = computedOptionNames.value[0]
		setModelValue(0)
	}

	query.value = typeToDisplayName(model.value)
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
