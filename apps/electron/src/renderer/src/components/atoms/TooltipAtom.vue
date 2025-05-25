<template>
	<TransitionAtom v-on="transitionHooks">
		<div class="a-tooltip" v-if="show" :style="absolutePositions">
			<slot> {{ parentSize }} </slot>
		</div>
	</TransitionAtom>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { computed, onMounted, ref } from 'vue'
import TransitionAtom from './TransitionAtom.vue'
import { sleepTimer } from '@web/utility/sleep'

// PROPS
const props = withDefaults(
	defineProps<{
		show: boolean
		parent: HTMLElement | undefined
		maxWidth?: number
	}>(),
	{
		maxWidth: 250,
	}
)

// STATE
const parentSize = ref<DOMRectReadOnly>()
const resizeObserver = new ResizeObserver(entries => {
	if (!entries || entries.length === 0) return
	parentSize.value = entries[0].contentRect
})

// COMPOSABLES
const transitionHooks = useGenericTransitionHooks({
	opacity: 0,
	scale: 0.01,
	duration: 0.15,
})

// GETTERS
const absolutePositions = computed(() => {
	if (!props.parent || !parentSize.value) return {}

	const rect = parentSize.value
	const top = props.parent.offsetTop
	const left = props.parent.offsetLeft
	// const width = rect.width
	const height = rect.height

	return {
		top: `${top + height}px`,
		left: `${left}px`,
	}
})

onMounted(async () => {
	while (!props.parent) {
		await sleepTimer(250)
	}

	console.log(props.parent)
	resizeObserver.observe(props.parent)
	console.log({ absolutePositions })
})
</script>

<style scoped>
.a-tooltip {
	position: absolute;
	background-color: black;
	z-index: 9999999;
	padding: 0.25rem 0.5rem;
	border-radius: var(--border-radius-medium);
	transform-origin: top left;
	max-width: v-bind(maxWidth + 'px');
}
</style>
