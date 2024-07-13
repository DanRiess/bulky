<template>
	<!-- <div class="main-app-window" ref="mainAppWindow" v-if="mainWindowActive || attachmentPanelActive"> -->
	<div class="main-app-window" ref="mainAppWindow" v-if="mainWindowActive">
		<NavbarOrganism />
		<router-view v-slot="{ Component }">
			<BaseTransition v-on="hooks" mode="out-in">
				<component :is="Component"></component>
			</BaseTransition>
		</router-view>
	</div>
	<div v-else-if="updatePanelActive || attachmentPanelActive" class="update-panel-window">
		<router-view v-slot="{ Component }">
			<BaseTransition v-on="hooks" mode="out-in">
				<component :is="Component" v-bind="routerProps"></component>
			</BaseTransition>
		</router-view>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { BaseTransition, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from './stores/configStore'
import { useStashStore } from './stores/stashStore'
import { useAuthStore } from './stores/authStore'
import { useLeagueStore } from './stores/leagueStore'
import NavbarOrganism from './components/organisms/NavbarOrganism.vue'
import { useRouteTransitionHooks } from './transitions/routeTransitionHooks'
import { useShopStore } from './stores/shopStore'
import { AppUpdateStatus } from '@shared/types/electron.types'
import { ProgressInfo } from 'electron-updater'

// STORES
const configStore = useConfigStore()
const stashStore = useStashStore()
const authStore = useAuthStore()
const leagueStore = useLeagueStore()
const shopStore = useShopStore()

// STATE
const mainAppWindow = ref<HTMLElement | null>(null)
const mainWindowActive = ref(false)
const updatePanelActive = ref(false)
const attachmentPanelActive = ref(false)
const appUpdateStatus = ref<AppUpdateStatus>('CHECKING_FOR_UPDATE')
const appDownloadProgress = ref<ProgressInfo>()

// COMPOSABLES
const hooks = useRouteTransitionHooks()
const router = useRouter()

console.log(import.meta.env.VITE_NO_ATTACH_MODE)
if (import.meta.env.VITE_NO_ATTACH_MODE === 'true') {
	mainWindowActive.value = true
	router.push('Bazaar')
}

// EVENTS
// window.api.onToggleOverlayComponent(value => {
// 	if (updatePanelActive.value || attachmentPanelActive.value) return
// 	mainWindowActive.value = value.overlayWindowActive
// })

// window.api.onAppUpdate((status, info) => {
// 	updatePanelActive.value = true
// 	appUpdateStatus.value = status
// 	appDownloadProgress.value = info
// 	router.push({ name: 'AppUpdate' })
// })

// window.api.onShowAttachmentPanel(value => {
// 	attachmentPanelActive.value = true
// 	router.push({ name: 'AttachmentPanel' })
// 	setTimeout(() => {
// 		attachmentPanelActive.value = false
// 		router.push({ name: 'Bazaar' })
// 	}, value.time)
// })

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
onClickOutside(mainAppWindow, () => {
	mainWindowActive.value = false
	window.api.closeOverlay()
})

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
</style>
