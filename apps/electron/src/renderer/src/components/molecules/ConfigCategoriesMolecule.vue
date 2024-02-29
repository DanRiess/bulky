<template>
	<div class="m-config-categories flow">
		<header class="header no-select">
			<h2>Categories</h2>
		</header>
		<ul class="category-list">
			<ListItemAtom :active="true">General</ListItemAtom>
		</ul>
	</div>
</template>

<script setup lang="ts">
import ListItemAtom from '../atoms/ListItemAtom.vue'
</script>

<style scoped>
.m-config-categories {
	padding: 0.5rem;
	list-style: none;
}

.category-list {
	margin-left: 1rem;
}
</style>
