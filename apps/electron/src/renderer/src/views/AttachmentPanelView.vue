<template>
	<div class="attachment-panel-view animated-gradient-background" data-b-override>
		<SvgIconAtom name="bulky" width="48" :use-gradient="true" :active="true" />
		<h1 class="header">Bulky is running in the background</h1>
		<section class="info">Press Ctrl + Space to open the overlay</section>
	</div>
</template>

<script setup lang="ts">
import SvgIconAtom from '@web/components/atoms/SvgIconAtom.vue'
</script>

<style scoped>
.attachment-panel-view {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
	width: max-content;
	background-color: var(--color-darker);
	border: 1px solid var(--color-dark);
	border-radius: 1rem;
	padding: 1rem;
	margin-bottom: 35%;
}

.header {
	font-size: 1.1rem;
	font-weight: 700;
}
</style>
