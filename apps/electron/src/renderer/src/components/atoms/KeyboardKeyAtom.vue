<template>
	<kbd class="a-keyboard-key" v-if="keyToRender !== ''">
		{{ keyToRender }}
	</kbd>
	<div v-else>Not set</div>
</template>

<script setup lang="ts">
// PROPS
defineProps<{
	keyToRender: string
}>()
</script>

<style scoped>
.a-keyboard-key {
	border: 2px solid var(--color-light-200);
	box-shadow: 2px 2px var(--color-light-300);
	line-height: 0.85em;
	display: inline-block;
	font-weight: 600;
	letter-spacing: 0.05em;
	padding: 3px 5px;
	white-space: nowrap;
}
</style>
