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
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'
import ButtonAtom from '@web/components/atoms/ButtonAtom.vue'
import SvgIconAtom from '@web/components/atoms/SvgIconAtom.vue'
import BuyTemplate from '@web/components/templates/BuyTemplate.vue'
import SellTemplate from '@web/components/templates/SellTemplate.vue'
import ConfigTemplate from '@web/components/templates/ConfigTemplate.vue'
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'

// STORES
const appStateStore = useAppStateStore()

// teststuff
const dto = {
	uuid: '8f40b64e-bf10-4054-a004-7ae3486fe621',
	ign: 'SomeName',
	league: 'Affliction',
	chaosPerDiv: 140,
	category: 'Compass',
	multiplier: 1.7,
	minimumBuyout: 1400,
	payload: {
		abyss: [
			{
				uses: 4,
				amount: 219,
				price: 130,
			},
		],
		beyond: [
			{
				uses: 16,
				amount: 87,
				price: 250,
			},
		],
		mirrorOfDelirium: [
			{
				uses: 4,
				amount: 40,
				price: 260,
			},
		],
		remnantOfCorruption: [
			{
				uses: 4,
				amount: 209,
				price: 50,
			},
		],
		physicalMonsters: [
			{
				uses: 16,
				amount: 23,
				price: 3,
			},
		],
	},
}
// test if everything is reactive
setTimeout(() => {
	const dto2 = {
		uuid: '8f40b64e-bf10-4054-a004-7ae3496fe621',
		ign: 'SomeName',
		league: 'Affliction',
		chaosPerDiv: 140,
		category: 'Compass',
		multiplier: 1.3,
		minimumBuyout: 1400,
		payload: {
			abyss: [
				{
					uses: 4,
					amount: 219,
					price: 1,
				},
			],
			beyond: [
				{
					uses: 16,
					amount: 87,
					price: 250,
				},
			],
			'8mods': [
				{
					uses: 3,
					amount: 40,
					price: 260,
				},
			],
			remnantOfCorruption: [
				{
					uses: 4,
					amount: 209,
					price: 50,
				},
			],
			physicalMonsters: [
				{
					uses: 16,
					amount: 23,
					price: 3,
				},
			],
		},
	}
	compassListingStore.addOrModifyListing(dto2)
}, 3000)

const compassListingStore = useCompassListingStore()
compassListingStore.addOrModifyListing(dto)

const component = computed(() => {
	if (appStateStore.selectedView === 'BUY') return markRaw(BuyTemplate)
	else if (appStateStore.selectedView === 'SELL') return markRaw(SellTemplate)
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

/* .main {
	display: grid;
	grid-template-columns: minmax(450px, 1.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
} */
</style>
@web/categories/compass/compassListing.store
