<template>
	<!-- <div class="main-app-window" ref="mainAppWindow" v-if="mainWindowActive || attachmentPanelActive"> -->

	<!-- The main bulky window -->
	<div class="main-app-window" ref="mainAppWindow" v-if="appStateStore.appActive">
		<NavbarOrganism />
		<router-view v-slot="{ Component }">
			<TransitionAtom v-on="hooks" mode="out-in">
				<component :is="Component"></component>
			</TransitionAtom>
		</router-view>
	</div>

	<!-- Update / attachment window shown on app startup -->
	<div v-else-if="updatePanelActive || attachmentPanelActive" class="update-panel-window">
		<router-view v-slot="{ Component }">
			<TransitionAtom v-on="hooks" mode="out-in">
				<component :is="Component" v-bind="routerProps"></component>
			</TransitionAtom>
		</router-view>
	</div>

	<!-- Notifications element. Only shown when there are any notifications -->
	<div class="notifications-panel" ref="notificationPanelElement">
		<NotificationOrganism />
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from './stores/configStore'
import { useStashStore } from './stores/stashStore'
import { useAuthStore } from './stores/authStore'
import { useLeagueStore } from './stores/leagueStore'
import { useNotificationStore } from './stores/notificationStore'
import NavbarOrganism from './components/organisms/NavbarOrganism.vue'
import { useRouteTransitionHooks } from './transitions/routeTransitionHooks'
import { useShopStore } from './stores/shopStore'
import { AppUpdateStatus } from '@shared/types/electron.types'
import { ProgressInfo } from 'electron-updater'
import NotificationOrganism from './components/organisms/NotificationOrganism.vue'
import TransitionAtom from './components/atoms/TransitionAtom.vue'
import { useAppStateStore } from './stores/appStateStore'

// STORES
const appStateStore = useAppStateStore()
const configStore = useConfigStore()
const stashStore = useStashStore()
const authStore = useAuthStore()
const leagueStore = useLeagueStore()
const shopStore = useShopStore()
const notificationStore = useNotificationStore()

// STATE
const mainAppWindow = ref<HTMLElement | null>(null)
const notificationPanelElement = ref<HTMLElement>()
const updatePanelActive = ref(false)
const attachmentPanelActive = ref(false)
const appUpdateStatus = ref<AppUpdateStatus>('CHECKING_FOR_UPDATE')
const appDownloadProgress = ref<ProgressInfo>()

// COMPOSABLES
const hooks = useRouteTransitionHooks()
const router = useRouter()

console.log({ noAttachMode: import.meta.env.VITE_NO_ATTACH_MODE })
if (import.meta.env.VITE_NO_ATTACH_MODE === 'true') {
	appStateStore.appActive = true
	router.push('Bazaar')
}

// EVENTS
if (import.meta.env.VITE_NO_ATTACH_MODE === 'false') {
	window.api.onToggleOverlayComponent(value => {
		if (updatePanelActive.value || attachmentPanelActive.value) return
		appStateStore.appActive = value
		console.log(value)
	})

	window.api.onAppUpdate((status, info) => {
		updatePanelActive.value = true
		appUpdateStatus.value = status
		appDownloadProgress.value = info
		router.push({ name: 'AppUpdate' })
	})

	window.api.onShowAttachmentPanel(value => {
		attachmentPanelActive.value = true
		router.push({ name: 'AttachmentPanel' })
		setTimeout(() => {
			attachmentPanelActive.value = false
			router.push({ name: 'Bazaar' })
		}, value.time)
	})

	window.api.onSendNotification(dto => {
		console.log({ notificationDto: dto })
		if (dto.type === 'trade') {
			const notification = notificationStore.createTradeNotification({ ign: dto.ign, tradeData: dto.message })
			notificationStore.addTrade(notification)
		}
	})
}
router.push('Bazaar')

const routerProps = computed(() => {
	if (router.currentRoute.value.name === 'AppUpdate') {
		return {
			updateStatus: appUpdateStatus.value,
			downloadProgress: appDownloadProgress.value,
		}
	}
	return {}
})

// METHODS
onClickOutside(
	mainAppWindow,
	() => {
		appStateStore.appActive = false
		window.api.closeOverlay()
	},
	{ ignore: [notificationPanelElement] }
)

// INITIALIZE NECESSARY STORES
configStore.getUserConfig()
stashStore.initialize()
authStore.initialize()
leagueStore.initialize()
shopStore.initialize()
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/variables.css';
@import './assets/css/common.css';
@import './assets//css/animations.css';

body {
	font-family: Montserrat, Helvetica, sans-serif;
}

#app {
	color: var(--dr-color-app);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	overflow: hidden;
	/* opacity: 0.9; */
}

.main-app-window {
	height: 700px;
	width: 1100px;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	border-radius: 1rem;
	padding: 1rem;
	background-color: var(--dr-background-color-app);
}

.update-panel-window {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.notifications-panel {
	position: fixed;
	right: 0;
	bottom: 0;
	width: 350px;
	height: 100%;
	pointer-events: none;
}
</style>
