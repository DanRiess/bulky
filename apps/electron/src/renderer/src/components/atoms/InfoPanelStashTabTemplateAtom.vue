<template>
	<div class="a-info-panel-stash-tab-template flow">
		<h5>Why is this stash tab unselectable?</h5>
		<template v-if="appStateStore.selectedCategory === 'MAP_8_MOD'">
			<p>Necessary item data to identify 8 mod maps is not available for this stash type.</p>
			<p>Please put your 8 mod maps into a normal, premium or quad stash tab instead.</p>
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
