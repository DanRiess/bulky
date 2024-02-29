<template>
	<button class="a-button specular-glance-animation gradient-border" data-b-override :class="{ active }">
		<slot />
	</button>
</template>

<script setup lang="ts">
import { ButtonBackgroundColorScheme } from '@web/types/utitlity.types'
import { computed } from 'vue'

const { backgroundColor } = withDefaults(
	defineProps<{
		active?: boolean
		backgroundColor?: ButtonBackgroundColorScheme
	}>(),
	{
		active: false,
		backgroundColor: 'light',
	}
)

const backgroundColorButton = computed(() => {
	return backgroundColor === 'light' ? 'var(--dr-background-color-button-light)' : 'var(--dr-background-color-button-dark)'
})
</script>

<style scoped>
.a-button {
	--border-width: 2px;

	height: max-content;
	padding: 0.25em 0.5em;
	font-size: 1rem;
	background-image: v-bind(backgroundColorButton);
	color: inherit;
	cursor: pointer;
}

/* displays the border and runs the animation */
.a-button:not(:disabled):hover::before,
.a-button.active:not(:disabled)::before {
	--show-border: 1;
}

/* enable the specular glance effect animation on hover. */
.a-button:not(:disabled):hover::after {
	--show-specular-effect: initial;
}

.a-button.active:not(:disabled) {
	background-image: var(--dr-gradient-highlight-overlay), v-bind(backgroundColorButton);
}

.a-button:disabled {
	cursor: default;
	color: var(--color-darker);
	background-color: var(--color-dark);
}
</style>
