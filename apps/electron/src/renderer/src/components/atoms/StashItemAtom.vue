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
import { PoeItem } from '@shared/types/bulky.types'
import { BulkyNinjaPriceItem } from '@shared/types/ninja.types'

// PROPS
defineProps<{
	item: PoeItem
	ninjaData?: BulkyNinjaPriceItem
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
