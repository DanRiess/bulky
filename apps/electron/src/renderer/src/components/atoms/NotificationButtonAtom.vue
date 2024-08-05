<template>
	<div class="a-notification-button gradient-border" data-b-override>
		<SvgIconAtom name="notifications" width="48" />
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import SvgIconAtom from './SvgIconAtom.vue'
import { computed } from 'vue'

// STORES
const configStore = useConfigStore()

// GETTERS
const offsetRight = computed(() => configStore.config.notifications.offsetRight)
</script>

<style scoped>
.a-notification-button {
	--border-width: 2px;

	background-color: black;
	width: 3rem;
	height: 3rem;
	border-radius: var(--border-radius-small);
	pointer-events: all;
	cursor: pointer;
	margin-right: v-bind(offsetRight);
}

.a-notification-button:hover {
	--show-border: 1;
}
</style>
