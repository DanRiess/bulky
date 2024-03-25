<template>
	<div class="o-stash-tab-list radial-gradient flow" data-b-override>
		<header class="title">
			<h2 class="no-select">Stash Tabs {{ fetchStatus }}</h2>
			<!-- <SvgIconAtom name="refresh" /> -->
			<TransitionAtom v-on="hooks">
				<SvgButtonWithPopupMolecule
					icon-name="refresh"
					background-color="dark"
					v-if="showRefreshButton"
					@click="fetchStash">
					Refresh Stash List
				</SvgButtonWithPopupMolecule>
			</TransitionAtom>
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
import { Ref, onMounted, ref } from 'vue'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'
import SvgButtonWithPopupMolecule from '../molecules/SvgButtonWithPopupMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { ApiStatus } from '@web/api/api.types'

// STORES
const stashStore = useStashStore()
const fetchStatus = ref<Ref<ApiStatus>>()

// PROPS
defineProps<{
	showRefreshButton: boolean
}>()

// METHODS
function fetchStash() {
	const request = stashStore.fetchStashTabList()

	fetchStatus.value = request!.status
}

// HOOKS
const hooks = useGenericTransitionHooks({
	duration: 0.25,
	opacity: 0,
	translateY: '-100px',
})

// LIFECYCLE
onMounted(() => {
	stashStore.fetchStashTabList()
})
</script>

<style scoped>
.o-stash-tab-list {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto 1fr;
}

.title {
	display: grid;
	grid-template-columns: 1fr 2rem;
	align-items: center;
}

.stash-list {
	display: grid;
	grid-template-columns: 1.5rem 1fr;
	gap: 0.5rem;
	overflow: auto;
	padding-top: 1px; /* for the translated checkbox */
}
</style>
