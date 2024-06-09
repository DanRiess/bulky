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
			<PriceAtom :price="totalValue" label="Total Value:" />
			<ButtonAtom background-color="dark" @click="emit('generateOffer', items)" :disabled="disableOfferGenerationButton">
				Generate Offer
			</ButtonAtom>
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
import { computed, toValue } from 'vue'
import { BulkyItemRecord, TotalPrice } from '@shared/types/bulky.types'
import PriceAtom from '../atoms/PriceAtom.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'

// PROPS
const props = defineProps<{
	offerMultiplier: number
	disableOfferGenerationButton: boolean
}>()

// EMITS
const emit = defineEmits<{
	generateOffer: [items: BulkyItemRecord]
}>()

// STORES
const stashStore = useStashStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)
const stashTabRequest = useFetchStashItems(selectedStashTabs)

// COMPOSABLES
const { categoryFilteredItemsByStash, updateItemsByStash } = usePoeItems(selectedStashTabs)
const { prices, chaosPerDiv } = usePoeNinja()
const { itemOverrides, putItemOverride } = useItemOverrides()
const { items, sortItems } = useBulkyItems(categoryFilteredItemsByStash, prices, itemOverrides)

// GETTERS

/**
 * Calculate the total price of all selected item stacks.
 * Takes overrides and multipliers into account.
 */
const totalValue = computed<TotalPrice>(() => {
	let price = 0

	items.value.forEach(item => {
		if (!item.selected) return
		if (toValue(item.priceOverride) > 0) {
			price += toValue(item.priceOverride) * item.quantity
			return
		}
		price += toValue(item.price) * item.quantity * props.offerMultiplier
	})

	return {
		divine: Math.floor(price / chaosPerDiv.value),
		chaos: Math.floor(price % chaosPerDiv.value),
	}
})

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
