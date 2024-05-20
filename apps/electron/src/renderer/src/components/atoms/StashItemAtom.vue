<template>
	<li class="a-stash-item">
		<div class="icon">
			<img :src="item.icon" :alt="item.baseType" />
		</div>
		<div class="name">{{ item.baseType }}</div>
		<div class="stack-size">{{ item.stackSize }}</div>
		<div class="price">{{ ninjaData?.chaos ?? 0 }}</div>
	</li>
</template>

<script setup lang="ts">
import { NinjaItem } from '@shared/types/ninja.types'
import { PoeItem } from '@shared/types/poe.types'

// PROPS
defineProps<{
	item: PoeItem
	ninjaData?: NinjaItem
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
