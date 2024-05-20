<template>
	<ul class="m-stash-item-list">
		<StashItemAtom v-for="item in items[getKeys(items)[0]]" :item="item" :ninja-data="prices[item.baseType]" :key="item.id" />
	</ul>
</template>

<script setup lang="ts">
import StashItemAtom from '../atoms/StashItemAtom.vue'
import { getKeys } from '@shared/types/utility.types'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { PoeItemsByStash } from '@shared/types/poe.types'

// PROPS
defineProps<{
	items: PoeItemsByStash
	prices: NinjaPriceRecord
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
