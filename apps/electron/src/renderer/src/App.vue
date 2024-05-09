<template>
	<div class="main-app-window" ref="mainAppWindow" v-if="active || attachmentPanelActive">
		<NavbarOrganism />
		<router-view v-slot="{ Component }">
			<!-- some transition component here -->
			<BaseTransition v-on="hooks" mode="out-in">
				<component :is="Component"></component>
			</BaseTransition>
		</router-view>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { BaseTransition, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from './stores/configStore'
import { useStashStore } from './stores/stashStore'
import { useAuthStore } from './stores/authStore'
import { useLeagueStore } from './stores/leagueStore'
import NavbarOrganism from './components/organisms/NavbarOrganism.vue'
import { useRouteTransitionHooks } from './transitions/routeTransitionHooks'

// STORES
const configStore = useConfigStore()
const stashStore = useStashStore()
const authStore = useAuthStore()
const leagueStore = useLeagueStore()

// STATE
const mainAppWindow = ref<HTMLElement | null>(null)
const active = ref(true)
const attachmentPanelActive = ref(false)

// COMPOSABLES
const hooks = useRouteTransitionHooks()
const router = useRouter()
router.push('Bazaar')

// EVENTS
// window.api.onToggleOverlayComponent(value => {
// 	active.value = value.overlayWindowActive
// })

// window.api.onShowAttachmentPanel(value => {
// 	router.push({ name: 'AttachmentPanel' })
// 	attachmentPanelActive.value = true
// 	setTimeout(() => {
// 		attachmentPanelActive.value = false
// 		router.push({ name: 'Home' })
// 	}, value.time)
// })

// METHODS
onClickOutside(mainAppWindow, () => {
	active.value = false
	window.api.closeOverlay()
})

// INITIALIZE NECESSARY STORES
configStore.getUserConfig()
stashStore.initialize()
authStore.initialize()
leagueStore.initialize()

// HOOKS
onMounted(() => {
	if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
		authStore.isLoggedIn = true
	}
})
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
	height: 600px;
	width: 1000px;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	border-radius: 1rem;
	padding: 1rem;
	background-color: var(--dr-background-color-app);
}
</style>
