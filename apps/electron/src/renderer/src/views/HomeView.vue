<template>
	<div class="home-view">
		<header class="header">
			<ButtonAtom :active="appStateStore.selectedView === 'BUY'" @click="appStateStore.selectedView = 'BUY'">
				Buy
			</ButtonAtom>
			<ButtonAtom :active="appStateStore.selectedView === 'SELL'" @click="appStateStore.selectedView = 'SELL'">
				Sell
			</ButtonAtom>
			<div class="user-icon" @click="appStateStore.selectedView = 'CONFIG'">
				<SvgIconAtom
					name="settings"
					:use-gradient="true"
					cursor="pointer"
					:active="appStateStore.selectedView === 'CONFIG'"></SvgIconAtom>
			</div>
		</header>
		<TransitionAtom v-on="transitionHooks" mode="out-in">
			<component :is="component" />
		</TransitionAtom>
	</div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import ButtonAtom from '@web/components/atoms/ButtonAtom.vue'
import SvgIconAtom from '@web/components/atoms/SvgIconAtom.vue'
import BuyTemplate from '@web/components/templates/BuyTemplate.vue'
import ConfigTemplate from '@web/components/templates/ConfigTemplate.vue'
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import SellListingTemplate from '@web/components/templates/SellListingTemplate.vue'
import SellAddTemplate from '@web/components/templates/SellAddTemplate.vue'

// STORES
const appStateStore = useAppStateStore()

const component = computed(() => {
	if (appStateStore.selectedView === 'BUY') return markRaw(BuyTemplate)
	else if (appStateStore.selectedView === 'SELL' && appStateStore.selectedSellView === 'LIST')
		return markRaw(SellListingTemplate)
	else if (appStateStore.selectedView === 'SELL' && appStateStore.selectedSellView === 'ADD') return markRaw(SellAddTemplate)
	else if (appStateStore.selectedView === 'CONFIG') return markRaw(ConfigTemplate)
	return undefined
})

const transitionHooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleY(0.01)',
	duration: 0.25,
})
</script>

<style scoped>
.home-view {
	--button-width: 2rem;
	--button-height: 2rem;

	height: 600px;
	width: 1000px;
	background-color: var(--dr-background-color-app);
	border-radius: 1rem;
	padding: 1rem;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
}

.header {
	display: grid;
	gap: 0.5rem;
	grid-template-columns: 7rem 7rem 1fr auto;
	margin-bottom: 1rem;
}

.user-icon {
	grid-column: 4/4;
}
</style>
