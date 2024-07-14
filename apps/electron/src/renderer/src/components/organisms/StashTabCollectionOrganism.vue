<template>
	<div class="o-stash-tab-collection animated-gradient-background flow" data-b-override>
		<header class="header">
			<h2 class="no-select">Stash Tabs</h2>
			<TransitionAtom v-on="hooks">
				<SvgButtonWithPopupMolecule
					:svg-props="svgIconProps"
					:tooltip-props="{
						position: 'bottom',
						transitionDirection: 'toBottom',
						popupAlignment: 'right',
					}"
					background-color="dark"
					v-if="timeout <= 0"
					@click="fetchStash">
					Refresh Stash List
				</SvgButtonWithPopupMolecule>
			</TransitionAtom>
		</header>
		<div v-if="stashStore.stashTabs.length === 0">No tabs found. Please load your stashes.</div>
		<ul v-else class="stash-list">
			<template v-for="stash in stashTabHierarchy.root" :key="stash.id">
				<LabelWithCheckboxMolecule
					v-if="stash.type !== 'Folder'"
					:disabled="excludedStashTypes.includes(stash.type)"
					label-position="right"
					v-model="stash.selected"
					@update:model-value="selected => updateStashPropSelected(stash, selected)">
					{{ stash.name }}
				</LabelWithCheckboxMolecule>
				<ul v-else class="stash-folder-list" :style="{ borderColor: '#' + stash.color ?? 'transparent' }">
					<li>{{ stash.name }} Folder</li>
					<LabelWithCheckboxMolecule
						v-for="child in stashTabHierarchy[stash.id]"
						:disabled="excludedStashTypes.includes(child.type)"
						:has-info-panel="excludedStashTypes.includes(child.type)"
						label-position="right"
						v-model="child.selected"
						@update:model-value="selected => updateStashPropSelected(child, selected)">
						{{ child.name }}
						<template #infoSlot>
							<InfoPanelStashTabTemplateAtom />
						</template>
					</LabelWithCheckboxMolecule>
				</ul>
			</template>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'
import SvgButtonWithPopupMolecule from '../molecules/SvgButtonWithPopupMolecule.vue'
import { useStashStore } from '@web/stores/stashStore'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { PoeStashTab, PoeStashType } from '@shared/types/poe.types'
import { useBulkyIdb } from '@web/composables/useBulkyIdb'
import { useAppStateStore } from '@web/stores/appStateStore'
import { getKeys } from '@shared/types/utility.types'
import InfoPanelStashTabTemplateAtom from '../atoms/InfoPanelStashTabTemplateAtom.vue'

// LOCAL TYPES
type StashTabHierarchy = {
	root: PoeStashTab[]
} & {
	[key: string]: PoeStashTab[]
}

// STORES
const stashStore = useStashStore()
const appStateStore = useAppStateStore()

// STATE
const stashListRequest = stashStore.getStashTabListRequest()
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

// COMPOSABLES
const bulkyIdb = useBulkyIdb()

// GETTERS
const stashTabHierarchy = computed(() => {
	return stashStore.stashTabs.reduce(
		(prev, curr) => {
			if (curr.parentId) {
				prev[curr.parentId] ? prev[curr.parentId].push(curr) : (prev[curr.parentId] = [curr])
			} else {
				prev.root.push(curr)
			}
			return prev
		},
		{ root: [] } as StashTabHierarchy
	)
})

const svgIconProps = computed(() => {
	return {
		name: 'refresh',
		rotate: stashListRequest.request.statusPending.value,
		useGradient: stashListRequest.request.statusPending.value,
		width: '100%',
	}
})

/**
 * Stash types that should be disabled when conditions are fulfilled.
 */
const excludedStashTypes = computed<PoeStashType[]>(() => {
	if (appStateStore.selectedCategory === 'MAP_8_MOD') {
		return ['MapStash']
	}
	return []
})

/**
 * When the excluded stash types change, unselect stash tabs that should be excluded.
 */
watch(excludedStashTypes, excludedTypes => {
	if (excludedTypes.length === 0) return

	const stashTabKeys = getKeys(stashTabHierarchy.value)
	for (const key of stashTabKeys) {
		stashTabHierarchy.value[key].forEach(tab => {
			if (excludedTypes.includes(tab.type)) {
				tab.selected = false
			}
		})
	}
})

// METHODS
async function fetchStash() {
	await stashListRequest.execute()

	if (stashListRequest.request.statusSuccess) {
		updateTimeout()
	}
}

/**
 * Update the timeout value and call this function recursively after 1 second until the timeout is 0.
 */
function updateTimeout() {
	timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

	// Don't actually use setInterval, it has some weird edge cases in which it doesn't use the delay at all.
	if (timeout.value > 0) {
		setTimeout(() => {
			updateTimeout()
		}, 1000)
	}
}

/**
 * Update the idb entry when the user (un)selects a stash tab.
 */
async function updateStashPropSelected(stash: PoeStashTab, selected: boolean) {
	stash.selected = selected
	await bulkyIdb.putStashTabs([stash])
}

// HOOKS
const hooks = useGenericTransitionHooks({
	duration: 0.35,
	opacity: 0,
	scale: 0,
})
</script>

<style scoped>
.o-stash-tab-collection {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto 1fr;
	overflow-y: auto;
}

.header {
	display: grid;
	grid-template-columns: 1fr 2rem;
	align-items: center;
	height: 2rem;
}

.stash-list {
	display: grid;
	grid-template-columns: 1.5rem 1fr;
	gap: 0.5rem;
	overflow: auto;
	padding-top: 1px; /* for the translated checkbox */
	padding-right: 0.5rem; /* padding towards the scrollbar */
}

.stash-folder-list {
	grid-column: span 2;
	display: grid;
	grid-template-columns: 3.5rem 1fr;
	gap: 0.5rem;
	border: 2px solid;
	border-radius: var(--border-radius-medium);
}

.stash-folder-list > li {
	padding: 0.25rem 0 0 0.25rem;
	grid-column: span 2;
}

.stash-folder-list > div {
	padding-left: 2rem;
}

.stash-folder-list > div:last-child {
	padding-bottom: 0.25rem;
}
</style>
