<template>
	<div class="m-load-stash-tabs">
		<LastSyncedAtom />
		<SvgButtonWithPopupMolecule
			:svg-props="svgIconProps"
			:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }"
			background-color="dark"
			:disabled="syncButtonDisabled"
			:always-show-tooltip="selectedStashTabLength > maxParallelRequests"
			@click="emit('syncFolders')">
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
import { ApiStatus } from '@web/api/api.types'

// PROPS
const props = withDefaults(
	defineProps<{
		syncRequestStatus: ApiStatus
	}>(),
	{
		syncRequestStatus: 'IDLE',
	}
)

// EMITS
const emit = defineEmits<{
	syncFolders: []
}>()

// STORES
const stashStore = useStashStore()
const rateLimitStore = useRateLimitStore()

// STATE
const maxParallelRequests = rateLimitStore.getMaxRequestsForShortestTestPeriod('poe')
const { selectedStashTabs } = storeToRefs(stashStore)
// const stashTabRequest = useFetchStashItems(selectedStashTabs)

// GETTERS
const selectedStashTabLength = computed(() => {
	return selectedStashTabs.value.length
})

const svgIconProps = computed(() => {
	return {
		name: 'refresh',
		rotate: props.syncRequestStatus === 'PENDING',
		useGradient: props.syncRequestStatus === 'PENDING',
		width: '100%',
		timeout: timer.value,
	}
})

const syncButtonDisabled = computed(() => {
	return selectedStashTabLength.value === 0 || selectedStashTabLength.value > maxParallelRequests || timer.value > 0
})

// COMPOSABLES
const { timer } = useRateLimitTimer('poe', selectedStashTabLength)
</script>

<style scoped>
.m-load-stash-tabs {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
