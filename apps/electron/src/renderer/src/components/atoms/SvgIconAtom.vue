<template>
	<!-- the svg -->
	<component
		:is="iconComponent"
		class="a-svg-icon"
		:class="{ active, rotate }"
		:width="width"
		:height="height ?? width"
		role="img">
	</component>

	<!-- the gradient. i tried moving this to another component and load it here, but css url loading failed -->
	<svg style="width: 0; height: 0; position: absolute" aria-hidden="true" focusable="false" class="svg-gradient">
		<linearGradient :id="gradientId" x2="1" y2="1">
			<stop class="stop" offset="0%" :stop-color="gradientStopColors[0]"></stop>
			<stop class="stop" offset="100%" :stop-color="gradientStopColors[1]"></stop>
		</linearGradient>
	</svg>
</template>

<script setup lang="ts">
import { v4 } from 'uuid'
import { computed, defineAsyncComponent, ref } from 'vue'
import { upperFirst, camelCase } from 'lodash'

const props = withDefaults(
	defineProps<{
		name: string
		active?: boolean
		useGradient?: boolean
		gradientStopColors?: string[]
		color?: string
		hoverColor?: string
		transform?: string
		cursor?: 'default' | 'pointer' | 'inherit'
		height?: number | string
		width?: number | string
		rotate?: boolean
	}>(),
	{
		active: false,
		useGradient: false,
		color: 'currentcolor',
		gradientStopColors: () => ['var(--dr-gradient-from-bright)', 'var(--dr-gradient-to-bright)'],
		cursor: 'inherit',
		height: '100%',
		width: 24,
	}
)

// define a random id for the gradient.
// has to be done, since a linearGradient is instantiated with every icon
const gradientId = ref(v4())
const gradientIdUrl = `url(#${gradientId.value})`

/** return either the url of the gradient or the specified hover color */
const hoverFill = computed(() => {
	return props.useGradient ? gradientIdUrl : props.hoverColor ? props.hoverColor : props.color
})

/** Instantiate the icon. Uses the capitalized svg's name as source. */
const iconComponent = computed(() => {
	return defineAsyncComponent(
		() =>
			import(
				/* webpackChunkName: "icon-[request]" */ `../../assets/svg-icons/${upperFirst(
					camelCase(props.name)
				)}Icon.vue?component`
			)
	)
})
</script>

<style scoped>
.a-svg-icon {
	display: inline-block;
	vertical-align: baseline;
	transform-origin: 50% 50%;
	transition: transform 0.15s ease;
	filter: drop-shadow(2px 2px 4px rgba(0 0 0 / 0.4));
	width: var(--dr-button-width);
	height: var(--dr-button-height);
	fill: v-bind(color);
	cursor: v-bind(cursor);
	transform: v-bind(transform);
}

.a-svg-icon:hover,
.a-svg-icon.active {
	fill: v-bind(hoverFill);
}

.a-svg-icon.rotate {
	fill: v-bind(hoverFill);
	animation: rotate 1s forwards linear infinite;
}

.stop {
	animation-duration: 2000ms;
	animation-iteration-count: infinite;
	animation-timing-function: ease-in-out;
	animation-play-state: paused;
}

.stop:first-child {
	animation-name: stop1;
	animation-delay: 500ms;
}

.stop:nth-child(2) {
	animation-name: stop2;
}

.a-svg-icon:hover + .svg-gradient > linearGradient > .stop,
.a-svg-icon.active + .svg-gradient > linearGradient > .stop,
.a-svg-icon.rotate + .svg-gradient > linearGradient > .stop {
	animation-play-state: running;
}

@keyframes stop1 {
	0% {
		stop-color: var(--dr-gradient-from-bright);
	}
	50% {
		stop-color: var(--dr-gradient-to-bright);
	}
	100% {
		stop-color: var(--dr-gradient-from-bright);
	}
}

@keyframes stop2 {
	0% {
		stop-color: var(--dr-gradient-to-bright);
	}
	50% {
		stop-color: var(--dr-gradient-from-bright);
	}
	100% {
		stop-color: var(--dr-gradient-to-bright);
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
