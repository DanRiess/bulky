<template>
	<div class="m-category">
		<IconButtonAtom
			v-for="comp in components"
			:file-name="comp.fileName"
			:display-name="comp.displayName"
			:active="appStateStore.selectedCategory === comp.category"
			@click="onClick(comp.category)"></IconButtonAtom>
	</div>
</template>

<script setup lang="ts">
import IconButtonAtom from '@web/components/atoms/IconButtonAtom.vue'
import { ref } from 'vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import { CATEGORY, Category } from '@shared/types/bulky.types'

// STORES
const appStateStore = useAppStateStore()

// STATE
const components = ref([
	{ displayName: 'Essences', fileName: 'essence-woe-deafening', category: CATEGORY.ESSENCE },
	{ displayName: 'Scarabs', fileName: 'scarab-breach-gilded', category: CATEGORY.SCARAB },
	{ displayName: 'Delirium Orbs', fileName: 'deli-orb-scarab', category: CATEGORY.DELIRIUM_ORB },
	{ displayName: 'Maps', fileName: 'underground-river-map', category: CATEGORY.MAP },
	{ displayName: '8 Mod Maps', fileName: 'vaal-temple-map', category: CATEGORY.MAP_8_MOD },
	{ displayName: 'Beasts', fileName: 'bestiary-orb', category: CATEGORY.BESTIARY },
	{ displayName: 'Delve', fileName: 'fossil-sanctified', category: CATEGORY.DELVE },
	{ displayName: 'Catalysts', fileName: 'catalyst-unstable', category: CATEGORY.CATALYST },
])

// METHODS
function onClick(category: Category) {
	appStateStore.selectedCategory = category
}
</script>

<style scoped>
.m-category {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}
</style>
