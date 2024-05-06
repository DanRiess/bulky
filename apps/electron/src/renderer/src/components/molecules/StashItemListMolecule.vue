<template>
	<ul class="m-stash-item-list">
		<StashItemAtom v-for="item in items[getKeys(items)[0]]" :item="item" :ninja-data="prices[item.baseType]" :key="item.id" />
	</ul>
</template>

<script setup lang="ts">
import { BulkyItemsByStash } from '@shared/types/bulky.types'
import StashItemAtom from '../atoms/StashItemAtom.vue'
import { getKeys } from '@shared/types/utility.types'
import { CurrentNinjaPrices } from '@shared/types/ninja.types'

// PROPS
defineProps<{
	items: BulkyItemsByStash
	prices: CurrentNinjaPrices
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
