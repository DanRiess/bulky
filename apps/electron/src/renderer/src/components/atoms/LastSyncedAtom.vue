<template>
	<div class="a-last-synced">
		{{ message }}
	</div>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import { useStashStore } from '@web/stores/stashStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// STORES
const stashStore = useStashStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)

// GETTERS
const oldestSyncTime = computed(() => {
	const syncTimes = selectedStashTabs.value.map(t => t.lastSnapshot)
	return syncTimes.sort((a, b) => a - b)[0]
})

// COMPOSABLES
const timeAgo = useTimeAgo(oldestSyncTime, { updateInterval: 1000 })

// MESSAGE
const message = computed(() => {
	if (oldestSyncTime.value === 0) {
		return 'Last synced: never'
	} else if (selectedStashTabs.value.length > 0) {
		return `Last synced: ${timeAgo.value}`
	} else {
		return 'Last synced: no data available'
	}
})
</script>
