<template>
	<main class="t-sell-add">
		<div class="main-container flow">
			<div class="category-input">
				<LabelWithSelectMolecule :options="categories" v-model="appStateStore.selectedCategory" background-color="light">
					Select Category:
				</LabelWithSelectMolecule>
			</div>

			<StashTabListOrganism :show-refresh-button="timeout <= 0" />

			<div class="timeout" v-show="timeout > 0">Next refresh possible in {{ minutes }}:{{ seconds }} minutes.</div>
		</div>

		<div class="main-container"></div>
	</main>
</template>

<script setup lang="ts">
import { getKeys } from '@web/types/utility.types'
import StashTabListOrganism from '../organisms/StashTabListOrganism.vue'
import { CATEGORY } from '@web/types/bulky.types'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import { computed, onMounted, ref } from 'vue'
import { useStashStore } from '@web/stores/stashStore'

// STORES
const appStateStore = useAppStateStore()
const stashStore = useStashStore()

// STATE
const categories = getKeys(CATEGORY).filter(i => i !== 'UNSUPPORTED')
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

console.log(timeout.value)

// GETTERS
const minutes = computed(() => {
	console.log(timeout.value)
	return Math.floor((timeout.value * 0.001) / 60)
})

const seconds = computed(() => {
	const s = Math.floor((timeout.value * 0.001) % 60)
	return s < 10 ? `0${s}` : s
})

// LIFECYCLE
onMounted(() => {
	setInterval(() => {
		timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())
	}, 1000)
})
</script>

<style scoped>
.t-sell-add {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) minmax(0, max-content);
	transition: grid-template-rows 3s ease;
}

.category-input {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 0.5rem;
}

.timeout {
	text-align: right;
	font-size: 0.8rem;
}
</style>
