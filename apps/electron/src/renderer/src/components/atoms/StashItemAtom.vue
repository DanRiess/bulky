<template>
	<li class="a-stash-item">
		<div class="icon">
			<img :src="item.icon" :alt="item.baseType" />
		</div>
		<div class="name">{{ item.baseType }}</div>
		<div class="stack-size">{{ item.stackSize }}</div>
	</li>
</template>

<script setup lang="ts">
import { BulkyItem } from '@shared/types/bulky.types'

// PROPS
defineProps<{
	item: BulkyItem
}>()
</script>

<style scoped>
.a-stash-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 4;
	height: 2rem;
}
</style>
