<template>
	<button
		class="a-button-svg specular-glance-animation gradient-border"
		data-b-override
		:class="{ active }"
		:disabled="disabled">
		<slot />
	</button>
</template>

<script setup lang="ts">
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		active?: boolean
		backgroundColor?: ButtonBackgroundColorScheme
		disabled?: boolean
	}>(),
	{
		active: false,
		backgroundColor: 'light',
		disabled: false,
	}
)

const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})
</script>

<style scoped>
.a-button-svg {
	--border-width: 2px;

	/* height: max-content; */
	height: 2rem;
	width: 2rem;
	background-image: v-bind(backgroundColorButton);
	color: inherit;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* displays the border and runs the animation */
.a-button-svg:not(:disabled):hover::before,
.a-button-svg.active:not(:disabled)::before {
	--show-border: 1;
}

/* enable the specular glance effect animation on hover. */
.a-button-svg:not(:disabled):hover::after {
	--show-specular-effect: initial;
}

.a-button-svg.active:not(:disabled) {
	background-image: var(--dr-gradient-highlight-overlay), v-bind(backgroundColorButton);
}

.a-button-svg:disabled {
	cursor: default;
	color: var(--color-darker);
	background-color: v-bind(backgroundColorButton);
}
</style>
