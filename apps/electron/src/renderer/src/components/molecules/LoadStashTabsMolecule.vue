<template>
	<div class="m-load-stash-tabs">
		<LastSyncedAtom />
		<SvgButtonWithPopupMolecule
			:svg-props="svgIconProps"
			:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }"
			background-color="dark"
			:disabled="syncButtonDisabled"
			:always-show-tooltip="selectedStashTabLength > maxParallelRequests"
			@click="syncSelectedFolders">
			<template v-if="selectedStashTabLength > maxParallelRequests">
				You have selected {{ selectedStashTabLength }} stashes, but the maximum is {{ maxParallelRequests }}
			</template>
			<template v-else-if="selectedStashTabLength === 0">Select at least one stash tab to start syncing</template>
			<template v-else-if="timer > 0">Resync possible in {{ timer }} seconds</template>
			<template v-else>Resync Selected Stashes</template>
		</SvgButtonWithPopupMolecule>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStashStore } from '@web/stores/stashStore'
import { useRateLimitTimer } from '@web/composables/useRateLimitTimer'
import { useRateLimitStore } from '@web/stores/rateLimitStore'
import { storeToRefs } from 'pinia'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import LastSyncedAtom from '../atoms/LastSyncedAtom.vue'
import { useFetchStashItems } from '@web/composables/useFetchStashItems'
import { PoeItemsByStash } from '@shared/types/poe.types'

// EMITS
const emit = defineEmits<{
	syncFolders: [items: PoeItemsByStash]
}>()

// STORES
const stashStore = useStashStore()
const rateLimitStore = useRateLimitStore()

// STATE
const maxParallelRequests = rateLimitStore.getMaxRequestsForShortestTestPeriod('poe')
const { selectedStashTabs } = storeToRefs(stashStore)
// const stashTabRequest = useFetchStashItems(selectedStashTabs)

const selectedStashTabLength = computed(() => {
	return selectedStashTabs.value.length
})

// COMPOSABLES
const stashTabRequest = useFetchStashItems(selectedStashTabs)
const { timer } = useRateLimitTimer('poe', selectedStashTabLength)

// GETTERS

const svgIconProps = computed(() => {
	return {
		name: 'refresh',
		rotate: stashTabRequest.statusPending.value,
		useGradient: stashTabRequest.statusPending.value,
		width: '100%',
		timeout: timer.value,
	}
})

const syncButtonDisabled = computed(() => {
	return selectedStashTabLength.value === 0 || selectedStashTabLength.value > maxParallelRequests || timer.value > 0
})

// METHODS

/**
 * Synchronize the items in the selected folders.
 */
async function syncSelectedFolders() {
	// Download the selected folder's items.
	await stashTabRequest.execute()

	// Handle error. Don't return, as there might still be results.
	if (stashTabRequest.error.value) {
		// TODO: log error
		console.log(stashTabRequest.error.value)
	}

	if (stashTabRequest.data.value) {
		emit('syncFolders', stashTabRequest.data.value)
	}
}
</script>

<style scoped>
.m-load-stash-tabs {
	display: flex;
	justify-content: space-between;
	align-items: center;

	/* Make sure that this component is on top the element below it (because of popup) */
	z-index: 10;
}
</style>
