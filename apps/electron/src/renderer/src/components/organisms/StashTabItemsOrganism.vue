<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule />
	</div>
</template>

<script setup lang="ts">
import LoadStashTabsMolecule from '../molecules/LoadStashTabsMolecule.vue'
</script>

<style scoped>
.o-stash-tab-items {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto 1fr;
}
</style>
