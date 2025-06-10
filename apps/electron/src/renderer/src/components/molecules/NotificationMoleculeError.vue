<template>
	<div
		class="m-error-notification animated-gradient-background"
		data-b-override
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave">
		<div class="status" v-if="notification.status" @click="notificationStore.remove(notification)">
			<LoadingSpinnerAtom
				box-size="24px"
				stroke-width="3px"
				v-if="notification.status === 'PENDING' || notification.status === 'IDLE'" />
			<SvgIconAtom
				v-else-if="notification.status === 'ERROR'"
				name="close"
				:width="32"
				cursor="pointer"
				color="var(--color-error)" />
			<SvgIconAtom
				v-else-if="notification.status === 'SUCCESS'"
				name="checkmark"
				:width="32"
				cursor="pointer"
				color="var(--color-success)" />
		</div>
		<p class="message-content">
			{{ notification.message }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { ErrorNotification } from '@shared/types/general.types'
import { useNotificationStore } from '@web/stores/notificationStore'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import LoadingSpinnerAtom from '../atoms/LoadingSpinnerAtom.vue'

// STORES
const notificationStore = useNotificationStore()

// PROPS
const props = defineProps<{
	notification: ErrorNotification
	idx: number
}>()

// STATE

// COMPOSABLES

// METHODS
/**
 * Clear the disappear timeout from the notification so it stays visible on hover.
 */
function onMouseEnter() {
	clearTimeout(props.notification.timeout)
}

/**
 * Add a new disappear timeout on mouseleave.
 */
function onMouseLeave() {
	notificationStore.resetTimeout(props.notification)
}
</script>

<style scoped>
.m-error-notification {
	width: 100%;
	display: grid;
	grid-template-columns: 3rem 1fr;
	gap: 0.5rem;
	align-items: center;
	min-height: 3rem;
	border-radius: var(--border-radius-small);
	font-size: 0.85rem;
	pointer-events: all;
	padding: 0.25rem 0.5rem;
	z-index: v-bind('100' - idx);
}

.highlight {
	color: var(--color-success);
}

.error {
	color: var(--color-error);
}

.buttons {
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	margin-top: 0.25rem;
}

.button-group {
	display: flex;
	gap: 0.25rem;
}

.status {
	display: flex;
	justify-content: center;
	align-items: center;
}

.message-content {
	cursor: default;
	white-space: pre-line;
	word-break: break-word;
}
</style>
