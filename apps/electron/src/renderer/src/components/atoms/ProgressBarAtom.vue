<template>
	<div class="progress-bar" :style="{ '--width': percentage }" />
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		percentage: number
	}>(),
	{
		percentage: 0,
	}
)
</script>

<style scoped>
.progress-bar {
	width: calc(100% - 6px);
	height: 100%;
	min-height: 1rem;
	position: relative;
}

.progress-bar::after {
	content: '';
	position: absolute;
	inset: 3px 0;
	min-width: 2px;
	width: calc(var(--width, 0) * 1%);
	border-radius: 5px;
	background: linear-gradient(45deg, var(--dr-gradient-from-bright), var(--dr-gradient-to-bright));
	transition: all 0.3s ease;
}
</style>
