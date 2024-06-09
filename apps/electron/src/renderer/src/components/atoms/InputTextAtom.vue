<template>
	<div class="a-input-text gradient-border" :class="{ 'forbid-edit': !editable }" :data-b-override="allowBorder">
		<!-- displays a greyed out suggestion. optional -->
		<input type="text" class="suggestion-input" :value="suggestion" disabled />
		<input
			type="text"
			class="input-text"
			:id="id"
			:disabled="disabled"
			:placeholder="placeholder"
			v-model="model"
			@focus="emit('focus')"
			@blur="emit('blur')" />
	</div>
</template>

<script setup lang="ts">
import { ButtonBackgroundColorScheme, Uuid } from '@shared/types/utility.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { computed } from 'vue'

// MODEL
const model = defineModel<string>({ required: true })

// PROPS
const props = withDefaults(
	defineProps<{
		id?: Uuid
		editable?: boolean
		disabled?: boolean
		placeholder?: string
		suggestion?: string
		backgroundColor?: ButtonBackgroundColorScheme
	}>(),
	{
		id: BULKY_UUID.generateTypedUuid(),
		editable: true,
		disabled: false,
		placeholder: '',
		suggestion: '',
		backgroundColor: 'dark',
	}
)

// GETTERS
const allowBorder = computed(() => {
	return !props.editable || props.disabled ? null : true
})

const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

// EMITS
const emit = defineEmits<{
	blur: []
	focus: []
}>()
</script>

<style scoped>
.a-input-text {
	--border-radius: var(--border-radius-small);
	--border-width: 1px;
	--transition-duration: 0.1s;

	position: relative;
}

/* Show the animated border on hover or focus-visible */
.a-input-text:has(.input-text:not(:disabled)):hover::before,
.a-input-text:has(.input-text:not(:disabled):focus-visible)::before {
	--show-border: 1;
}

.input-text {
	color: inherit;
	background-image: v-bind(backgroundColorButton);
	border-radius: var(--border-radius);
	border: none;
	line-height: 1.5em;
	padding: 0.25em;
	cursor: pointer;
	max-width: 100%;
	width: 100%;
}

.input-text:focus {
	border: none;
	outline: none;
}

.input-text:disabled {
	opacity: 0.5;
	pointer-events: none;
	user-select: none;
}

.forbid-edit {
	pointer-events: none;
	user-select: none;
	cursor: default;
}

.suggestion-input {
	position: absolute;
	inset: 0;
	border: none;
	line-height: 1.5em;
	padding: 0.25em;
	cursor: pointer;
	border-radius: var(--border-radius);
	color: inherit;
	background-color: transparent;
	pointer-events: none;
	user-select: none;
	opacity: 0.5;
}
</style>
