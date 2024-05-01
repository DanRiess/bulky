<template>
	<div class="m-load-stash-tabs">
		<LastSyncedAtom />
		<SvgButtonWithPopupMolecule
			:svg-props="svgIconProps"
			:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }"
			background-color="dark"
			:always-show-tooltip="selectedStashTabLength > maxParallelRequests"
			@click="">
			<template v-if="selectedStashTabLength > maxParallelRequests">
				You have selected {{ selectedStashTabLength }} stashes, but the maximum is {{ maxParallelRequests }}
			</template>
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
import { usePoeItems } from '@web/composables/usePoeItems'
import { storeToRefs } from 'pinia'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import { useFetchStashItems } from '@web/utility/fetchStashItems'
import LastSyncedAtom from '../atoms/LastSyncedAtom.vue'

// STORES
const stashStore = useStashStore()
const rateLimitStore = useRateLimitStore()

// STATE
const maxParallelRequests = rateLimitStore.getMaxRequestsForShortestTestPeriod('poe')
const { selectedStashTabs } = storeToRefs(stashStore)
const stashItemRequest = useFetchStashItems(selectedStashTabs.value)

// GETTERS
const selectedStashTabLength = computed(() => {
	return selectedStashTabs.value.length
})

const svgIconProps = computed(() => {
	return {
		name: 'refresh',
		rotate: stashItemRequest.statusPending.value,
		useGradient: stashItemRequest.statusPending.value,
		width: '100%',
		timeout: timer.value,
	}
})

// const buttonDisabled = computed(() => {
// 	return selectedStashTabLength.value === 0 || selectedStashTabLength.value > maxParallelRequests || timer.value > 0
// })

// const buttonText = computed(() => {
// 	if (selectedStashTabLength.value === 0 || selectedStashTabLength.value > maxParallelRequests) {
// 		return 'Load Selected Stash Tabs'
// 	} else if (timer.value > 0) {
// 		return `Wait ${timer.value} seconds`
// 	} else {
// 		return 'Load Selected Stash Tabs'
// 	}
// })

// COMPOSABLES
const { timer } = useRateLimitTimer('poe', selectedStashTabLength)
const { items } = usePoeItems(selectedStashTabs)
console.log(items.value)
</script>

<style scoped>
.m-load-stash-tabs {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
