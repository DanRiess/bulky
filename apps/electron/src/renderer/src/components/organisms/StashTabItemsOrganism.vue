<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule @sync-folders="syncSelectedFolders" />

		<template v-if="category === 'MAP'">
			<StashItemListMapMolecule
				:items="items"
				:override-prices="itemOverrides"
				:sort-fn="sortItems"
				:offer-multiplier="offerMultiplier"
				@change-item-override="(item, options) => putItemOverride(item, options)" />
		</template>
		<template v-else>
			<StashItemListMolecule
				:items="items"
				:override-prices="itemOverrides"
				:sort-fn="sortItems"
				:offer-multiplier="offerMultiplier"
				@change-item-override="(item, options) => putItemOverride(item, options)" />
		</template>

		<div class="total-value">
			<PriceAtom :price="divValue" label="Total Value:" />
			<template v-if="operation === 'create'">
				<ButtonAtom
					background-color="dark"
					@click="emit('generateOffer', items)"
					:disabled="disableOfferGenerationButton">
					Generate Offer
				</ButtonAtom>
			</template>
			<template v-else-if="operation === 'edit'">
				<ButtonAtom background-color="dark" @click="emit('syncChanges', items)">Sync Changes</ButtonAtom>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import LoadStashTabsMolecule from '../molecules/LoadStashTabsMolecule.vue'
import { useStashStore } from '@web/stores/stashStore'
import { usePoeItems } from '@web/composables/usePoeItems'
import { storeToRefs } from 'pinia'
import StashItemListMolecule from '../molecules/StashItemListMolecule.vue'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useBulkyItems } from '@web/composables/useBulkyItems'
import { useItemOverrides } from '@web/composables/useItemOverrides'
import { BulkyShopItemRecord, Category } from '@shared/types/bulky.types'
import PriceAtom from '../atoms/PriceAtom.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'
import { PoeItemsByStash } from '@shared/types/poe.types'
import StashItemListMapMolecule from '../molecules/StashItemListMapMolecule.vue'

// PROPS
const props = defineProps<{
	operation: 'create' | 'edit'
	offerMultiplier: number
	category: Category
	disableOfferGenerationButton?: boolean
}>()

// EMITS
const emit = defineEmits<{
	generateOffer: [items: BulkyShopItemRecord]
	syncChanges: [items: BulkyShopItemRecord]
}>()

// STORES
const stashStore = useStashStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)

// COMPOSABLES
const { filterItemsByCategory, updateItemsByStash } = usePoeItems(selectedStashTabs)
const categoryFilteredItemsByStash = filterItemsByCategory(() => props.category)
const { prices, chaosPerDiv } = usePoeNinja(() => props.category)
const { itemOverrides, putItemOverride } = useItemOverrides(() => props.category)
const { items, sortItems } = useBulkyItems(categoryFilteredItemsByStash, prices, itemOverrides, () => props.category)

// GETTERS
const chaosValue = useAggregateItemPrice(items, () => props.offerMultiplier)
const divValue = useChaosToDiv(chaosValue, chaosPerDiv)

// METHODS

/**
 * Synchronize the items in the selected folders.
 */
async function syncSelectedFolders(items: PoeItemsByStash) {
	await updateItemsByStash(items)
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
