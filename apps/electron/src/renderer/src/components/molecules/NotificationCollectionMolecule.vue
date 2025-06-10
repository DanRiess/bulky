<template>
	<ul class="m-notification-collection" @mouseenter="setIgnoreMouseEvents(false)" @mouseleave="setIgnoreMouseEvents(true)">
		<TransitionAtom :group="true" v-on="listTransitionHooks">
			<NotificationMoleculeError
				v-for="errorNotification in notificationStore.notifications.errors"
				:notification="errorNotification"
				:idx="0" />
		</TransitionAtom>
		<TransitionAtom :group="true" v-on="listTransitionHooks">
			<NotificationMoleculeTrade
				v-for="(_, idx) in activeTradeNotifications"
				:notification="activeTradeNotifications[idx]"
				:idx="idx" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import TransitionAtom from '../atoms/TransitionAtom.vue'
import NotificationMoleculeTrade from './NotificationMoleculeTrade.vue'
import { useNotificationStore } from '@web/stores/notificationStore'
import { computed, watch } from 'vue'
import { useListTransition } from '@web/transitions/listTransition'
import { setIgnoreMouseEvents } from '@web/utility/setIgnoreMouseEvents'
import NotificationMoleculeError from './NotificationMoleculeError.vue'

// STORES
const notificationStore = useNotificationStore()

// COMPOSABLES
const listTransitionHooks = useListTransition({
	duration: 0.35,
	translateX: '100%',
})

// GETTERS
const activeTradeNotifications = computed(() => {
	return notificationStore.notifications.trades.filter(n => n.show)
})

// WATCHERS
watch(
	() => activeTradeNotifications.value.length,
	n => {
		// If active notifications reach 0, the mouseleave event won't be triggered anymore.
		// The game window then becomes unresponsive, because mouse events won't click through anymore.
		// Force ignore mouse events in this case.
		if (n === 0) {
			setIgnoreMouseEvents(true)
		}
	}
)
</script>

<style scoped>
.m-notification-collection {
	display: grid;
	gap: 0.5rem;
	transform-origin: right;
	isolation: isolate;
	z-index: 1;
}
</style>
