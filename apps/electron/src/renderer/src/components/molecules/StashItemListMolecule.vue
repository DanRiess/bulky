<template>
	<ul class="m-stash-item-list">
		<StashItemAtom v-for="item in items[getKeys(items)[0]]" :item="item" :key="item.id" />
	</ul>
</template>

<script setup lang="ts">
import { BulkyItemsByStash } from '@shared/types/bulky.types'
import StashItemAtom from '../atoms/StashItemAtom.vue'
import { getKeys } from '@shared/types/utility.types'

// PROPS
defineProps<{
	items: BulkyItemsByStash
}>()
</script>

<style scoped>
.m-stash-item-list {
	display: grid;
	grid-template-columns: 1.5rem 2fr 1.5rem 1fr;
	column-gap: 0.5rem;
	overflow: auto;
}
</style>
