<template>
	<main class="t-buy">
		<div class="main-container">
			<CategoryMolecule />
			<ListingOrganism :listings="listings" />
		</div>
		<div class="main-container">
			<TransitionAtom v-on="fadeHooks">
				<FilterOrganism
					v-if="filterProps"
					:filter="filterProps.filter"
					:main-options="filterProps.mainOptions"
					:secondary-options="filterProps.secondaryOptions"
					@add-filter-field="filterProps.addFilterField"
					@remove-filter-field="filterProps.removeFilterField" />
			</TransitionAtom>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useCompassListingProps } from '@web/categories/compass/compassListing.props'
import { useCompassFilterProps } from '@web/categories/compass/compassFilter.props'
import { useAppStateStore } from '@web/stores/appStateStore'
import { computed, watch } from 'vue'
import FilterOrganism from '../organisms/FilterOrganism.vue'
import ListingOrganism from '../organisms/ListingOrganism.vue'
import CategoryMolecule from '../molecules/CategoryMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { useEssenceFilterProps } from '@web/categories/essence/essenceFilter.props'
import { useEssenceListingStore } from '@web/categories/essence/essenceListing.store'
import { useEssenceListingProps } from '@web/categories/essence/essenceListing.props'
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'

// STORES
const appStateStore = useAppStateStore()
const essenceListingStore = useEssenceListingStore()
const compassListingStore = useCompassListingStore()

const listings = computed(() => {
	if (appStateStore.selectedCategory === 'COMPASS') {
		return useCompassListingProps()
	} else if (appStateStore.selectedCategory === 'ESSENCE') {
		return useEssenceListingProps()
	}
	return []
})

const filterProps = computed(() => {
	if (appStateStore.selectedCategory === 'COMPASS') {
		return useCompassFilterProps()
	} else if (appStateStore.selectedCategory === 'ESSENCE') {
		return useEssenceFilterProps()
	}
	return undefined
})

// WATCHERS
watch(
	() => appStateStore.selectedCategory,
	cat => {
		if (cat === 'ESSENCE') {
			essenceListingStore.getTestData()
		} else if (cat === 'COMPASS') {
			compassListingStore.getTestData()
		}
	}
)

// HOOKS
const fadeHooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.35,
})
</script>

<style scoped>
.t-buy {
	display: grid;
	grid-template-columns: minmax(450px, 1.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
}
</style>
@web/categories/compass/compassFilter.props@web/categories/compass/compassListing.props
