<template>
	<button class="a-icon-button gradient-border" :class="active && 'active'" data-b-override>
		<img :src="imgSource" decoding="async" loading="lazy" />
		<div ref="nameEl" class="name">{{ displayName }}</div>
	</button>
</template>

<script setup lang="ts">
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'
import { getCanvasFont, getTextWidth } from '@web/utility/getTextWidth'
import { computed, ref } from 'vue'

export type IconButtonProps = {
	fileName: string
	displayName: string
	backgroundColor?: ButtonBackgroundColorScheme
	active?: boolean
	alt?: string
}

// PROPS
const {
	fileName,
	displayName,
	backgroundColor = 'light',
} = withDefaults(defineProps<IconButtonProps>(), {
	alt: '',
	active: false,
})

// STATE
const nameEl = ref<HTMLElement | undefined>()

// GETTERS
const backgroundColorButton = computed(() => {
	return backgroundColor === 'light' ? 'var(--dr-background-color-button-light)' : 'var(--dr-background-color-button-dark)'
})

const imgSource = computed(() => {
	return new URL(`/src/assets/png-icons/${fileName}.png`, import.meta.url).href
	// return `/src/assets/png-icons/${fileName}.png`
})

/** calculate the necessary width according to displayName length */
const gridColumnWidth = computed(() => {
	const width = getTextWidth(displayName, getCanvasFont(nameEl.value))
	// const width = getTextWidth(displayName, 'bold 1rem Montserrat')
	return width ? `${width + 4}px` : '0px'
})
</script>

<style scoped>
.a-icon-button {
	--right-column: 0ch;
	--transition-time: 0.15s;
	/* --border-width: 2px; */
	--border-radius: var(--border-radius-small);

	display: grid;
	grid-template-columns: 1.5rem var(--right-column);
	gap: 0;
	height: max-content;
	width: max-content;
	padding: 0.2rem;
	background-image: v-bind(backgroundColorButton);
	color: inherit;
	transition: grid-template-columns var(--transition-time) ease, gap var(--transition-time) ease;
	cursor: pointer;
	text-wrap: nowrap;
}

.a-icon-button:not(:disabled):hover::before,
.a-icon-button.active:not(:disabled)::before {
	--show-border: 1;
}

.name {
	transform: scaleX(0);
	transition: transform var(--transition-time) ease;
	transform-origin: left;
	text-align: left;
}

.a-icon-button.active:not(:disabled) {
	background-image: var(--dr-gradient-highlight-overlay), v-bind(backgroundColorButton);
	gap: 0.5rem;
	--right-column: v-bind(gridColumnWidth);

	& .name {
		transform: scaleX(1);
	}
}
</style>
