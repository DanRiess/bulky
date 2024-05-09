<template>
	<div class="v-home">
		<!-- <NavbarOrganism /> -->
		<TransitionAtom v-on="transitionHooks" mode="out-in">
			<component :is="component" />
		</TransitionAtom>
	</div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import BuyTemplate from '@web/components/templates/BuyTemplate.vue'
import ConfigTemplate from '@web/components/templates/ConfigTemplate.vue'
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import AuthTemplate from '@web/components/templates/AuthTemplate.vue'
import SalesRecordOverviewTemplate from '@web/components/templates/SalesRecordOverviewTemplate.vue'
import SalesRecordCreateTemplate from '@web/components/templates/SalesRecordCreateTemplate.vue'
// import { useApi } from '@web/api/useApi'
// import { poeApi } from '@web/api/poeApi'

// STORES
const appStateStore = useAppStateStore()

// GETTERS
const component = computed(() => {
	if (appStateStore.selectedView === 'BUY') return markRaw(BuyTemplate)
	else if (appStateStore.selectedView === 'AUTH') return markRaw(AuthTemplate)
	else if (appStateStore.selectedView === 'SELL' && appStateStore.selectedSellView === 'LIST')
		return markRaw(SalesRecordOverviewTemplate)
	else if (appStateStore.selectedView === 'SELL' && appStateStore.selectedSellView === 'ADD')
		return markRaw(SalesRecordCreateTemplate)
	else if (appStateStore.selectedView === 'CONFIG') return markRaw(ConfigTemplate)
	return undefined
})

// HOOKS
const transitionHooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleY(0.01)',
	duration: 0.25,
})
</script>

<style scoped>
.v-home {
	--button-width: 2rem;
	--button-height: 2rem;

	/* background-color: var(--dr-background-color-app); */
	/* border-radius: 1rem;
	padding: 1rem; */
	/* display: grid;
	grid-template-rows: auto minmax(0, 1fr); */
}
</style>
