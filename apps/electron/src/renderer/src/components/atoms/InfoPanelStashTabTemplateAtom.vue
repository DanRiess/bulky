<template>
	<div class="a-info-panel-stash-tab-template flow">
		<h5>Why is this stash tab unselectable?</h5>
		<template v-if="appStateStore.selectedCategory === 'MAP_8_MOD'">
			<p>The map stash tab return value does not contain the necessary item data to identify 8 mod maps.</p>
			<p>For now, please put your 8 mod maps into any other stash tab type and select that one instead.</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@web/stores/appStateStore'

const appStateStore = useAppStateStore()
</script>

<style scoped>
.a-info-panel-stash-tab-template > p {
	font-size: 0.8rem;
}
</style>
