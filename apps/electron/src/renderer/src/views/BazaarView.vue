<template>
	<DefaultLayout grid-template-columns="minmax(520px, 1.5fr) minmax(450px, 1fr)">
		<template #leftColumn>
			<div class="offer-collection-container flow">
				<CategoryMolecule />
				<BazaarOfferCollectionOrganism
					v-if="computedFilterStore"
					:store="computedOfferStore"
					:filter="computedFilterStore.filter" />
			</div>
		</template>
		<template #rightColumn>
			<div class="main-container">
				<TransitionAtom v-on="hooks">
					<FilterOrganism v-if="computedFilterStore" :store="computedFilterStore" />
				</TransitionAtom>
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { useEssenceOfferStore } from '@web/categories/essence/essenceOffers.store'
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import CategoryMolecule from '@web/components/molecules/CategoryMolecule.vue'
import BazaarOfferCollectionOrganism from '@web/components/organisms/BazaarOfferCollectionOrganism.vue'
import FilterOrganism from '@web/components/organisms/FilterOrganism.vue'
import { useComputedFilterStore } from '@web/composables/useComputedFilterStore'
import { useComputedOffersStore } from '@web/composables/useComputedOffersStore'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { watch } from 'vue'
import { useMap8ModOfferStore } from '@web/categories/map/map8ModOffers.store'

// STORES
const appStateStore = useAppStateStore()

// COMPOSABLES
const computedOfferStore = useComputedOffersStore()
const computedFilterStore = useComputedFilterStore()
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.35,
})

// WATCHERS
watch(
	() => appStateStore.selectedCategory,
	cat => {
		if (cat === 'ESSENCE') {
			useEssenceOfferStore().getTestData()
		} else if (cat === 'SCARAB') {
			console.log('scarab category')
		} else if (cat === 'DELIRIUM_ORB') {
			console.log('deli orb category')
		} else if (cat === 'MAP') {
			console.log('get map listings here')
		} else if (cat === 'MAP_8_MOD') {
			useMap8ModOfferStore().getTestData()
		}

		// makeBinTestData()
	},
	{ immediate: true }
)
</script>

<style scoped>
.offer-collection-container {
	display: grid;
	grid-template-rows: auto 1fr;
}
</style>
