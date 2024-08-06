<template>
	<ul class="m-notification-collection">
		<TransitionAtom :group="true" v-on="listTransitionHooks">
			<NotificationMoleculeTrade
				v-for="(_, idx) in activeNotifications"
				:notification="activeNotifications[idx]"
				:idx="idx" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import NotificationMoleculeTrade from './NotificationMoleculeTrade.vue'
import { useNotificationStore } from '@web/stores/notificationStore'
import { computed } from 'vue'

// STORES
const notificationStore = useNotificationStore()

// COMPOSABLES
const listTransitionHooks = useGenericTransitionHooks({
	duration: 0.25,
	translateX: '100%',
})

// GETTERS
const activeNotifications = computed(() => {
	return notificationStore.notifications.trades.filter(n => n.show)
})
</script>

<style scoped>
.m-notification-collection {
	display: grid;
	gap: 0.5rem;
	transform-origin: right;
	z-index: 2;
}
</style>
