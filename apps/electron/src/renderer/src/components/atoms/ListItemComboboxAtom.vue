<template>
	<li class="a-list-item specular-glance-animation" :class="{ hovered }" data-b-override @click="emit('click', displayName)">
		<div class="chevron">
			<SvgIconAtom name="chevron-right" :use-gradient="true" :active="true" />
		</div>
		<div class="content">{{ displayName }}</div>
	</li>
</template>

<script setup lang="ts">
import SvgIconAtom from './SvgIconAtom.vue'

export type SelectableListItem = {
	content: string
	value: string | number
}

defineProps<{
	displayName: string
	hovered: boolean
}>()

const emit = defineEmits<{
	click: [value: string]
}>()
</script>

<style scoped>
.a-list-item {
	--height: 2rem;
	--left-column: 0rem;
	--transition-time: 0.15s;

	display: grid;
	grid-template-columns: var(--left-column) 1fr;
	transition: grid-template-columns var(--transition-time) ease;
	height: var(--height);
	align-items: center;
	user-select: none;
	cursor: pointer;
}

/* .a-list-item:not(:disabled):hover, */
.a-list-item:not(:disabled).hovered {
	--left-column: 1.5rem;
}

.a-list-item:not(:disabled):hover::after {
	--show-specular-effect: initial;
}

.chevron {
	height: var(--height);
}

.content {
	text-wrap: nowrap;
}
</style>
