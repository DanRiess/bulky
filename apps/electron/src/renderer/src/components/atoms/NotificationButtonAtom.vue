<template>
	<div class="a-notification-button gradient-border" data-b-override>
		<SvgIconAtom name="notifications" width="48" />
		<div class="notification-count">{{ notificationCount }}</div>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import SvgIconAtom from './SvgIconAtom.vue'
import { computed } from 'vue'

// STORES
const configStore = useConfigStore()

// PROPS
defineProps<{
	notificationCount: number
}>()

// GETTERS
const offsetRight = computed(() => configStore.config.notifications.offsetRight)
</script>

<style scoped>
.a-notification-button {
	--border-width: 2px;

	position: relative;
	background-color: black;
	width: 3rem;
	height: 3rem;
	border-radius: var(--border-radius-small);
	pointer-events: all;
	cursor: pointer;
	margin-right: v-bind(offsetRight);
}

.notification-count {
	position: absolute;
	top: 4px;
	right: 4px;
	background-color: var(--color-info);
	width: 1.2rem;
	height: 1.2rem;
	text-align: center;
	border-radius: 50%;
	font-weight: 600;
	font-size: 0.8rem;
	color: var(--color-purple-dark);
	user-select: none;
}

.a-notification-button:hover {
	--show-border: 1;
}
</style>
