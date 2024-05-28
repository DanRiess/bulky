<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule :sync-request-status="stashTabRequest.status.value" @sync-folders="syncSelectedFolders" />
		<StashItemListMolecule
			:items="items"
			:override-prices="priceOverrides"
			@change-price-override="(item, price) => putPriceOverride(item, price)" />
	</div>
</template>

<script setup lang="ts">
import LoadStashTabsMolecule from '../molecules/LoadStashTabsMolecule.vue'
import { useStashStore } from '@web/stores/stashStore'
import { usePoeItems } from '@web/composables/usePoeItems'
import { storeToRefs } from 'pinia'
import { useFetchStashItems } from '@web/composables/useFetchStashItems'
import StashItemListMolecule from '../molecules/StashItemListMolecule.vue'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useBulkyItems } from '@web/composables/useBulkyItems'
import { usePriceOverride } from '@web/composables/usePriceOverrides'

// STORES
const stashStore = useStashStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)
const stashTabRequest = useFetchStashItems(selectedStashTabs)

// COMPOSABLES
const { categoryFilteredItemsByStash, updateItemsByStash } = usePoeItems(selectedStashTabs)
const { prices } = usePoeNinja()
const { priceOverrides, putPriceOverride } = usePriceOverride()
const { items } = useBulkyItems(categoryFilteredItemsByStash, prices, priceOverrides)

// METHODS
async function syncSelectedFolders() {
	// Download the selected folder's items.
	await stashTabRequest.execute()

	// Handle error. Don't return, as there might still be results.
	if (stashTabRequest.error.value) {
		// TODO: handle error
		console.log(stashTabRequest.error.value)
	}

	if (stashTabRequest.data.value) {
		await updateItemsByStash(stashTabRequest.data.value)

		// Clear the downloaded data from memory.
		// Not particularly pretty, but necessary if we want to keep the request
		// and the items as separate composables I think.
		stashTabRequest.data.value = undefined
	}
}
</script>

<style scoped>
.o-stash-tab-items {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto 1fr;
	overflow: hidden;
}
</style>
