<template>
	<DefaultLayout grid-template-columns="minmax(520px, 1.5fr) minmax(450px, 1fr)">
		<template #leftColumn>
			<div class="offer-collection-container flow">
				<CategoryMolecule />
				<BazaarOfferCollectionOrganism
					v-if="computedFilterStore"
					:store="computedOfferStore"
					:filter="computedFilterStore.filter" />
				<RefetchOffersMolecule :timeRemaining="timeRemaining" />
			</div>
		</template>
		<template #rightColumn>
			<div class="filter-container">
				<TransitionAtom v-on="hooks">
					<FilterOrganism v-if="computedFilterStore" :store="computedFilterStore" />
				</TransitionAtom>
				<div class="support-section">
					<!-- Add a test MTN -->
					<button @click="addnote" v-if="isDev">Add Notification</button>
					<SupportMeMolecule />
				</div>
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import CategoryMolecule from '@web/components/molecules/CategoryMolecule.vue'
import RefetchOffersMolecule from '@web/components/molecules/RefetchOffersMolecule.vue'
import SupportMeMolecule from '@web/components/molecules/SupportMeMolecule.vue'
import BazaarOfferCollectionOrganism from '@web/components/organisms/BazaarOfferCollectionOrganism.vue'
import FilterOrganism from '@web/components/organisms/FilterOrganism.vue'
import { useComputedFilterStore } from '@web/composables/useComputedFilterStore'
import { useComputedOffersStore } from '@web/composables/useComputedOffersStore'
import { useRefetchOffers } from '@web/composables/useRefetchOffers'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'

// COMPOSABLES
const computedOfferStore = useComputedOffersStore()
const computedFilterStore = useComputedFilterStore()
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.35,
})

const { timeRemaining } = useRefetchOffers()

// Notification test stuff
import { useNotificationStore } from '@web/stores/notificationStore'

const notificationStore = useNotificationStore()
const isDev = import.meta.env.DEV

function addnote() {
	const n = notificationStore.createTradeNotification({
		ign: 'CountSudoku',
		// tradeData: '040560160128989%RX%12345',
		tradeData: `1%4%AEAADwAAABJBmAAA%"!gen|f el|s rec" "m q.*1[1-9].%"`,
		league: 'Standard',
	})

	notificationStore.addTrade(n)
}
</script>

<style scoped>
.offer-collection-container {
	display: grid;
	grid-template-rows: auto 1fr max-content;
	overflow-y: hidden;
	scrollbar-gutter: stable;
}

.filter-container {
	display: grid;
	grid-template-rows: max-content max-content;
	align-content: space-between;
}

.support-section {
	display: flex;
	justify-content: flex-end;
}
</style>
