<template>
	<div
		class="m-svg-button-with-popup"
		:class="{ disabled: computedDisabled }"
		@click="onClick"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave">
		<ButtonSvgAtom :active="hovered" :background-color="backgroundColor" :disabled="computedDisabled">
			<SvgIconAtom v-bind="svgProps" />
		</ButtonSvgAtom>
		<ButtonTooltipAtom :active="hovered || alwaysShowTooltip" v-bind="tooltipProps" :backgroundColor="backgroundColor">
			<slot />
		</ButtonTooltipAtom>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonTooltipAtom from '../atoms/ButtonTooltipAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import ButtonSvgAtom from '../atoms/ButtonSvgAtom.vue'
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'

// PROPS
const props = withDefaults(
	defineProps<{
		disabled?: boolean
		hoverColor?: string
		backgroundColor?: ButtonBackgroundColorScheme
		alwaysShowTooltip?: boolean
		svgProps: InstanceType<typeof SvgIconAtom>['$props']
		tooltipProps?: Omit<InstanceType<typeof ButtonTooltipAtom>['$props'], 'active'>
	}>(),
	{
		disabled: false,
		backgroundColor: 'dark',
		alwaysShowTooltip: false,
	}
)

// EMITS
const emit = defineEmits<{
	click: []
}>()

// STATE
const hovered = ref(false)

// GETTERS
const computedDisabled = computed(() => {
	if (props.svgProps.timeout) {
		return props.disabled || !!props.svgProps.timeout
	}

	return props.disabled
})

// METHODS
function onClick() {
	emit('click')
}

function onMouseEnter() {
	hovered.value = true
}

function onMouseLeave() {
	hovered.value = false
}
</script>

<style scoped>
.m-svg-button-with-popup {
	display: grid;
	grid-template-columns: var(--dr-button-width) auto;
	place-items: center;
	cursor: pointer;
	height: var(--dr-button-height);
	width: var(--dr-button-width);
	position: relative;
	transform-origin: center;
}

/* .m-svg-button-with-popup:not(.disabled):hover {
	color: v-bind(hoverColor);
} */

/* .button {
	border-radius: var(--border-radius-small);
	background-image: var(--dr-background-color-button-dark);
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.a-button:not(:disabled):hover::before,
.a-button.active:not(:disabled)::before {
	--show-border: 1;
} */

.disabled {
	opacity: 0.6;
}
</style>
