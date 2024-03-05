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
import { computed } from 'vue'
import FilterOrganism from '../organisms/FilterOrganism.vue'
import ListingOrganism from '../organisms/ListingOrganism.vue'
import CategoryMolecule from '../molecules/CategoryMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'

// STORES
const appStateStore = useAppStateStore()

const listings = computed(() => {
	if (appStateStore.selectedCategory === 'COMPASS') {
		return useCompassListingProps()
	}
	return []
})

const filterProps = computed(() => {
	if (appStateStore.selectedCategory === 'COMPASS') {
		return useCompassFilterProps()
	}
	return undefined
})

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
