<template>
	<DefaultLayout grid-template-columns="minmax(450px, 1.5fr) minmax(450px, 1fr)">
		<template #leftColumn>
			<div class="main-container flow">
				<CategoryMolecule />
				<BazaarOfferCollectionOrganism :offers="offers" />
			</div>
		</template>
		<template #rightColumn>
			<div class="main-container">
				<TransitionAtom v-on="hooks">
					<FilterOrganism
						v-if="filterProps"
						:filter="filterProps.filter"
						:main-options="filterProps.mainOptions"
						:secondary-options="filterProps.secondaryOptions"
						@add-filter-field="filterProps.addFilterField"
						@remove-filter-field="filterProps.removeFilterField" />
				</TransitionAtom>
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'
import { useEssenceListingStore } from '@web/categories/essence/essenceListing.store'
import TransitionAtom from '@web/components/atoms/TransitionAtom.vue'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import CategoryMolecule from '@web/components/molecules/CategoryMolecule.vue'
import BazaarOfferCollectionOrganism from '@web/components/organisms/BazaarOfferCollectionOrganism.vue'
import FilterOrganism from '@web/components/organisms/FilterOrganism.vue'
import { useFilterProps } from '@web/composables/filterProps'
import { useListingProps } from '@web/composables/listingProps'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { watch } from 'vue'

// STORES
const appStateStore = useAppStateStore()
const essenceListingStore = useEssenceListingStore()
const compassListingStore = useCompassListingStore()

// COMPOSABLES
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.35,
})
const offers = useListingProps()
const filterProps = useFilterProps()

// WATCHERS
watch(
	() => appStateStore.selectedCategory,
	cat => {
		if (cat === 'ESSENCE') {
			essenceListingStore.getTestData()
		} else if (cat === 'COMPASS') {
			compassListingStore.getTestData()
		}

		// makeBinTestData()
	}
)
</script>
