<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule :sync-request-status="stashTabRequest.status.value" @sync-folders="syncSelectedFolders" />
		<StashItemListMolecule
			:items="items"
			:override-prices="itemOverrides"
			:sort-fn="sortItems"
			:offer-multiplier="offerMultiplier"
			@change-item-override="(item, options) => putItemOverride(item, options)" />
		<div class="total-value">
			<PriceAtom :price="divValue" label="Total Value:" />
			<template v-if="!editOffer">
				<ButtonAtom
					background-color="dark"
					@click="emit('generateOffer', items)"
					:disabled="disableOfferGenerationButton">
					Generate Offer
				</ButtonAtom>
			</template>
			<template v-else>
				<ButtonAtom background-color="dark">Edit Offer</ButtonAtom>
				<ButtonAtom background-color="dark">Cancel</ButtonAtom>
			</template>
		</div>
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
import { useItemOverrides } from '@web/composables/useItemOverrides'
import { BulkyItemRecord } from '@shared/types/bulky.types'
import PriceAtom from '../atoms/PriceAtom.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'

// PROPS
const props = defineProps<{
	offerMultiplier: number
	disableOfferGenerationButton?: boolean
	editOffer?: boolean
}>()

// EMITS
const emit = defineEmits<{
	generateOffer: [items: BulkyItemRecord]
}>()

// STORES
const stashStore = useStashStore()
const appStateStore = useAppStateStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)
const { selectedCategory } = storeToRefs(appStateStore)

// COMPOSABLES
const stashTabRequest = useFetchStashItems(selectedStashTabs)
const { filterItemsByCategory, updateItemsByStash } = usePoeItems(selectedStashTabs)
const categoryFilteredItemsByStash = filterItemsByCategory(appStateStore.selectedCategory)
const { prices, chaosPerDiv } = usePoeNinja(selectedCategory)
const { itemOverrides, putItemOverride } = useItemOverrides()
const { items, sortItems } = useBulkyItems(categoryFilteredItemsByStash, prices, itemOverrides)

// GETTERS

/**
 * Calculate the total price of all selected item stacks.
 * Takes overrides and multipliers into account.
 */
const chaosValue = useAggregateItemPrice(items, props.offerMultiplier)
const divValue = useChaosToDiv(chaosValue, chaosPerDiv)

// METHODS

/**
 * Synchronize the items in the selected folders.
 */
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
	grid-template-rows: auto 1fr auto;
	overflow: hidden;
}

.total-value {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 2rem;
}
</style>
