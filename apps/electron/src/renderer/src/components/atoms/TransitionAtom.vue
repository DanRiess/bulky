<template>
	<component :is="type" :tag="tag" :css="false">
		<slot></slot>
	</component>
</template>

<script setup lang="ts">
import { Transition, TransitionGroup, computed, markRaw } from 'vue'

const props = withDefaults(
	defineProps<{
		group?: boolean
		duration?: number
		delay?: string
		zIndex?: string
		tag?: string
	}>(),
	{
		group: false,
		duration: 0.35,
		delay: '0s',
	}
)

const type = computed(() => (props.group ? markRaw(TransitionGroup) : markRaw(Transition)))
</script>
