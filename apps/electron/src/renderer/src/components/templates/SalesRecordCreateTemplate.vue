<template>
	<main class="t-sales-record-create">
		<div class="main-container stash-list flow">
			<div class="category-input">
				<LabelWithSelectMolecule :options="categories" v-model="appStateStore.selectedCategory" background-color="light">
					Select Category:
				</LabelWithSelectMolecule>
			</div>

			<StashTabListOrganism :show-refresh-button="timeout <= 0" @start-timeout="updateTimeout" />

			<div class="timeout" v-if="timeout > 0">Next refresh possible in {{ minutes }}:{{ seconds }} minutes.</div>
		</div>

		<div class="main-container flow">
			<StashTabItemsOrganism />
			<div class="buttons">
				<ButtonAtom>Back To My Listings</ButtonAtom>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import StashTabListOrganism from '../organisms/StashTabListOrganism.vue'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import { computed, onMounted, ref } from 'vue'
import { useStashStore } from '@web/stores/stashStore'
import { getKeys } from '@shared/types/utility.types'
import { CATEGORY } from '@shared/types/bulky.types'
import StashTabItemsOrganism from '../organisms/StashTabItemsOrganism.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'

// STORES
const appStateStore = useAppStateStore()
const stashStore = useStashStore()

// STATE
const categories = getKeys(CATEGORY).filter(i => i !== 'UNSUPPORTED')
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

// GETTERS
const minutes = computed(() => {
	return Math.floor((timeout.value * 0.001) / 60)
})

const seconds = computed(() => {
	const s = Math.floor((timeout.value * 0.001) % 60)
	return s < 10 ? `0${s}` : s
})

const stashListGridRows = computed(() => {
	return timeout.value <= 0 ? '2rem calc(100% - 2rem) 0rem' : '2rem calc(100% - 3.5rem) 1.5rem'
})

// METHODS
function updateTimeout() {
	timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

	// don't actually use setinterval, it has some weird edge cases in which it doesn't use the delay at all
	if (timeout.value > 0) {
		setTimeout(() => {
			updateTimeout()
		}, 1000)
	}
}

// LIFECYCLE
onMounted(() => {
	setInterval(() => {
		timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())
	}, 1000)
})
</script>

<style scoped>
.t-sales-record-create {
	display: grid;
	grid-template-columns: minmax(350px, 0.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, max-content);
	transition: grid-template-rows 0.3s ease;
}

/* override for the stash list */
.stash-list {
	grid-template-rows: v-bind(stashListGridRows);
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

.buttons {
	display: flex;
	justify-content: flex-end;
}
</style>
