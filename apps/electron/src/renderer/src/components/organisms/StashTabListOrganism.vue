<template>
	<div class="o-stash-tab-list radial-gradient flow" data-b-override>
		<header class="title">
			<h2 class="no-select">Stash Tabs</h2>
			<TransitionAtom v-on="hooks">
				<SvgButtonWithPopupMolecule
					:svg-props="svgIconProps"
					background-color="dark"
					v-if="showRefreshButton"
					@click="fetchStash">
					Refresh Stash List
				</SvgButtonWithPopupMolecule>
			</TransitionAtom>
		</header>
		<div v-if="stashStore.stashTabs.length === 0">No tabs found. Please load your stashes.</div>
		<ul v-else class="stash-list">
			<LabelWithCheckboxMolecule v-for="stash in stashStore.stashTabs" label-position="right" v-model="stash.selected">
				{{ stash.name }}
			</LabelWithCheckboxMolecule>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useStashStore } from '@web/stores/stashStore'
import { computed } from 'vue'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import SvgButtonWithPopupMolecule from '../molecules/SvgButtonWithPopupMolecule.vue'

// STORES
const stashStore = useStashStore()

// PROPS
defineProps<{
	showRefreshButton: boolean
}>()

// EMITS
const emit = defineEmits<{
	startTimeout: []
}>()

// STATE
const stashListRequest = stashStore.getStashTabListRequest()

// GETTERS
const svgIconProps = computed(() => {
	return {
		name: 'refresh',
		rotate: stashListRequest.request.statusPending.value,
		useGradient: stashListRequest.request.statusPending.value,
	}
})

// METHODS
async function fetchStash() {
	await stashListRequest.execute()

	if (stashListRequest.request.statusSuccess) {
		emit('startTimeout')
	}
}

// HOOKS
const hooks = useGenericTransitionHooks({
	duration: 0.35,
	opacity: 0,
	scale: 0,
})

// LIFECYCLE
// onMounted(() => {
// 	stashStore.fetchStashTabList()
// })
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
	padding-right: 0.5rem; /* padding towards the scrollbar */
}
</style>
