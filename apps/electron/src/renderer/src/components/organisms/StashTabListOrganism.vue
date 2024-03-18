<template>
	<div class="o-stash-tab-list radial-gradient flow" data-b-override>
		<header class="title">
			<h2 class="no-select">Stash Tabs</h2>
		</header>
		<ul class="stash-list">
			<LabelWithCheckboxMolecule v-for="stash in stashStore.stashTabs" label-position="right" v-model="stash.selected">
				{{ stash.name }}
			</LabelWithCheckboxMolecule>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useStashStore } from '@web/stores/stashStore'
import { onMounted } from 'vue'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'

// STORES
const stashStore = useStashStore()

// LIFECYCLE
onMounted(() => {
	stashStore.fetchStashTabList().then(() => {
		console.log(stashStore.stashTabs)
	})
})
</script>

<style scoped>
.o-stash-tab-list {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto 1fr;
}

.stash-list {
	display: grid;
	grid-template-columns: 1.5rem 1fr;
	gap: 0.5rem;
	overflow: auto;
}

.stash-list::-webkit-scrollbar {
	/* width: 5px; */
}

/* .stash-list::-webkit-scrollbar-track {
	border-radius: 1000vw;
	background-color: #ccc;
}

.stash-list::-webkit-scrollbar-thumb {
	border-radius: 1000vw;
	background-color: #ccc;
} */
</style>
