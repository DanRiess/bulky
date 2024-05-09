<template>
	<main class="t-layout">
		<slot name="leftColumn"></slot>
		<slot name="rightColumn"></slot>
	</main>
</template>

<script setup lang="ts">
/**
 * This is a classic 2-column grid layout.
 * The grid columns can be customized via props.
 */

// PROPS
withDefaults(
	defineProps<{
		gridTemplateColumns?: string
	}>(),
	{
		gridTemplateColumns: '1fr 1fr',
	}
)
</script>

<style scoped>
.t-layout {
	display: grid;
	grid-template-columns: v-bind(gridTemplateColumns);
	grid-template-rows: 1fr;
	gap: 2rem;
	margin-top: 1rem;
}
</style>
