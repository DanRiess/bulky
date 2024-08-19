<template>
	<div class="o-notification">
		<NotificationCollectionMolecule />
		<TransitionAtom v-on="transitionHooks">
			<div
				class="buttons"
				v-if="!notificationStore.forceHideTradeNotifications && notificationStore.notifications.trades.length > 0"
				@mouseenter="setIgnoreMouseEvents(false)"
				@mouseleave="setIgnoreMouseEvents(true)">
				<!-- <TransitionAtom v-on="transitionHooks">
					<div
						class="conditional-buttons"
						v-if="!notificationStore.forceHideTradeNotifications && notificationStore.forceShowTradeNotifications">
						<ButtonSvgAtom width="3rem" background-color="dark">
							<SvgIconAtom name="refresh" width="48" />
						</ButtonSvgAtom>
					</div>
				</TransitionAtom> -->
				<NotificationButtonAtom
					:notification-count="notificationStore.notifications.trades.length"
					@click="notificationStore.toggleTradeNotifications()" />
			</div>
		</TransitionAtom>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import NotificationButtonAtom from '../atoms/NotificationButtonAtom.vue'
import NotificationCollectionMolecule from '../molecules/NotificationCollectionMolecule.vue'
import { computed } from 'vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { useNotificationStore } from '@web/stores/notificationStore'
import { setIgnoreMouseEvents } from '@web/utility/setIgnoreMouseEvents'

// STORES
const configStore = useConfigStore()
const notificationStore = useNotificationStore()

// COMPOSABLES
const transitionHooks = useGenericTransitionHooks({
	duration: 0.25,
	opacity: 0,
	translateX: '3rem',
	scaleX: 0.01,
})

// GETTER
const offsetBottom = computed(() => configStore.config.notifications.offsetBottom)
</script>

<style scoped>
.o-notification {
	position: absolute;
	width: 100%;
	bottom: v-bind(offsetBottom);
	display: grid;
	gap: 1rem;
	pointer-events: all;
}

.buttons {
	display: flex;
	gap: 1rem;
	justify-self: end;
}
</style>
