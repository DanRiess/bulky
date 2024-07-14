<template>
	<TransitionAtom v-on="hooks">
		<div v-if="active" class="a-button-tooltip" :style="style">
			<slot></slot>
		</div>
	</TransitionAtom>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TransitionAtom from './TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'

export type TooltipPropsWithoutActive = {
	position?: 'top' | 'bottom' | 'right'
	transitionDirection?: 'toTop' | 'toBottom' | 'toRight'
	popupAlignment?: 'left' | 'right'
}

const props = withDefaults(
	defineProps<{
		active: boolean
		position?: 'top' | 'bottom' | 'right'
		transitionDirection?: 'toTop' | 'toBottom' | 'toRight'
		popupAlignment?: 'left' | 'right'
		backgroundColor?: ButtonBackgroundColorScheme
		maxWidth?: number
	}>(),
	{
		position: 'right',
		transitionDirection: 'toRight',
		popupAlignment: 'left',
		backgroundColor: 'dark',
		maxWidth: undefined, // will result in invalid css property and be ignored
	}
)

// GETTERS
const style = computed(() => {
	const style = {
		top: '0',
		left: '100%',
		right: 'unset',
		transformOrigin: 'left',
	}

	if (props.position === 'top') {
		style.top = '-100%'
		style.left = '0'
	} else if (props.position === 'bottom') {
		style.top = '100%'
		if (props.popupAlignment === 'left') {
			style.left = '0'
		} else if (props.popupAlignment === 'right') {
			style.right = '0'
			style.left = 'unset'
		}
	}

	if (props.transitionDirection === 'toBottom') {
		style.transformOrigin = 'top'
	} else if (props.transitionDirection === 'toTop') {
		style.transformOrigin = 'bottom'
	}

	return style
})

const transform = computed(() => {
	if (props.transitionDirection === 'toTop' || props.transitionDirection === 'toBottom') {
		return 'scaleY(0.01)'
	} else {
		return 'scaleX(0.01)'
	}
})

const backgroundColorButton = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

const hooks = useGenericTransitionHooks({
	duration: 0.15,
	opacity: 0,
	transform: transform.value,
})
</script>

<style scoped>
.a-button-tooltip {
	padding-inline: 0.5rem;
	background-image: v-bind(backgroundColorButton);
	display: flex;
	align-items: center;
	border: 1px solid var(--neb-bg-1);
	border-radius: var(--border-radius-small);
	transform-origin: left;
	user-select: none;
	width: max-content;
	max-width: v-bind(maxWidth + 'px');
	min-height: 100%;
	z-index: 15000;
	position: absolute;
}
</style>
