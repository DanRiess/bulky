<template>
	<ul class="o-listing flow">
		<TransitionAtom group v-on="hooks">
			<FallbackListingItemMolecule v-if="listings.length === 0" />
			<ListingItemMolecule
				v-for="(listing, idx) in listings"
				:key="listing.uuid"
				:filtered-listing="listing"
				:data-index="idx" />
		</TransitionAtom>
	</ul>
</template>

<script setup lang="ts">
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { FilteredListingDisplayValues } from '@web/types/bulky.types'
import ListingItemMolecule from '../molecules/ListingItemMolecule.vue'
import FallbackListingItemMolecule from '../molecules/fallbacks/FallbackListingItemMolecule.vue'

//PROPS
defineProps<{
	listings: FilteredListingDisplayValues[]
}>()

// HOOKS
const hooks = useListTransition()
</script>

<style scoped>
.o-listing {
	overflow: auto;
	border-radius: var(--border-radius-small);
}

.o-listing > .m-listing-item {
	margin-top: 1rem;
}
</style>
