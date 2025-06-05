<template>
	<div class="o-notification" :class="{ edit: notificationStore.editNotificationElement }" ref="notificationEl">
		<NotificationCollectionMolecule />
		<TransitionAtom v-on="transitionHooks">
			<div
				class="buttons"
				v-if="notificationStore.notifications.trades.length > 0"
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
import { computed, useTemplateRef, watch } from 'vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { useNotificationStore } from '@web/stores/notificationStore'
import { setIgnoreMouseEvents } from '@web/utility/setIgnoreMouseEvents'

// STORES
const configStore = useConfigStore()
const notificationStore = useNotificationStore()

// STATE
const notificationEl = useTemplateRef<HTMLElement>('notificationEl')
let isDragging = false
const draggingPosition = {
	x: 0,
	y: 0,
}

// COMPOSABLES
const transitionHooks = useGenericTransitionHooks({
	duration: 0.25,
	opacity: 0,
	translateX: '3rem',
	scaleX: 0.01,
})

// GETTER
const offsetBottom = computed(() => configStore.config.notifications.offsetBottom + 'px')
const offsetRight = computed(() => configStore.config.notifications.offsetRight + 'px')

// METHODS
function dragStart(e: MouseEvent) {
	isDragging = true

	draggingPosition.x = e.clientX
	draggingPosition.y = e.clientY
}

function drag(e: MouseEvent) {
	if (!isDragging) return

	const deltaX = e.clientX - draggingPosition.x
	const deltaY = e.clientY - draggingPosition.y

	configStore.config.notifications.offsetRight -= deltaX
	configStore.config.notifications.offsetBottom -= deltaY

	draggingPosition.x = e.clientX
	draggingPosition.y = e.clientY
}

function dragEnd() {
	isDragging = false
}

// WATCHERS
watch(
	() => notificationStore.editNotificationElement,
	edit => {
		if (edit) {
			notificationStore.toggleTradeNotifications(true)
			notificationEl.value?.addEventListener('mousedown', dragStart)
			notificationEl.value?.addEventListener('mousemove', drag)
			notificationEl.value?.addEventListener('mouseup', dragEnd)
		} else {
			notificationStore.toggleTradeNotifications(false)
			notificationEl.value?.removeEventListener('mousedown', dragStart)
			notificationEl.value?.removeEventListener('mousemove', drag)
			notificationEl.value?.removeEventListener('mouseup', dragEnd)
		}
	}
)
</script>

<style scoped>
.o-notification {
	position: absolute;
	width: 100%;
	bottom: v-bind(offsetBottom);
	right: v-bind(offsetRight);
	display: grid;
	gap: 1rem;
	pointer-events: all;
}

.buttons {
	display: flex;
	gap: 1rem;
	justify-self: end;
}

.edit {
	border: 2px solid red;
	cursor: move;
}
</style>
