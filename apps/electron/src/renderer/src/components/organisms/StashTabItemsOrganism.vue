<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule @sync-folders="syncSelectedFolders" />

		<div class="maybe-filter">
			<TransitionAtom v-on="transitionHooks">
				<ShopCreateOfferFilter v-if="category === 'MAP'" v-model="filterModel" :category="category" />
			</TransitionAtom>
		</div>

		<template v-if="category === 'MAP'">
			<StashItemListMoleculeMap
				:items="filteredItemRecord"
				:override-prices="itemOverrides"
				:sort-fn="sortItems"
				:offer-multiplier="offerMultiplier"
				@change-item-override="(item, options) => putItemOverride(item, options)" />
		</template>
		<template v-else-if="category === 'MAP_8_MOD'">
			<StashItemListMolecule8ModMap
				:items="filteredItemRecord as BulkyShopItemRecord<ShopMap8Mod>"
				:override-prices="itemOverrides"
				:sort-fn="sortItems"
				@change-item-override="(item, options) => putItemOverride(item, options)" />
		</template>
		<template v-else>
			<StashItemListMolecule
				:items="filteredItemRecord"
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
					@click="emit('generateOffer', filteredItemRecord, filterModel)"
					:disabled="disableOfferGenerationButton">
					Generate Offer
				</ButtonAtom>
			</template>
			<template v-else-if="operation === 'edit'">
				<ButtonAtom background-color="dark" @click="emit('syncChanges', filteredItemRecord)">Sync Changes</ButtonAtom>
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
import { BulkyShopItemRecord, Category, ShopFilter } from '@shared/types/bulky.types'
import PriceAtom from '../atoms/PriceAtom.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'
import { PoeItemsByStash } from '@shared/types/poe.types'
import { useFilterShopItems } from '@web/composables/useFilterShopItems'
import ShopCreateOfferFilter from '../molecules/ShopCreateOfferFilter.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import StashItemListMoleculeMap from '../molecules/StashItemListMoleculeMap.vue'
import StashItemListMolecule8ModMap from '../molecules/StashItemListMolecule8ModMap.vue'
import { ShopMap8Mod } from '@web/categories/map/map.types'

// MODEL
const filterModel = defineModel<ShopFilter>({ required: true })

// PROPS
const props = defineProps<{
	operation: 'create' | 'edit'
	offerMultiplier: number | undefined
	category: Category
	disableOfferGenerationButton?: boolean
}>()

// EMITS
const emit = defineEmits<{
	generateOffer: [items: BulkyShopItemRecord, filter: ShopFilter]
	syncChanges: [items: BulkyShopItemRecord]
}>()

// STORES
const stashStore = useStashStore()

// STATE
const { selectedStashTabs } = storeToRefs(stashStore)
// const filter = ref<ShopFilter>({ selectedTiers: new Set() })

// COMPOSABLES
const transitionHooks = useGenericTransitionHooks({
	opacity: 0,
	scale: 0.01,
	duration: 0.25,
})
const { filteredItemsByCategory, updateItemsByStash } = usePoeItems(selectedStashTabs)
const categoryFilteredItemsByStash = filteredItemsByCategory(() => props.category)
const { prices, chaosPerDiv } = usePoeNinja(() => props.category)
const { itemOverrides, putItemOverride } = useItemOverrides(() => props.category)
const { items, sortItems } = useBulkyItems(categoryFilteredItemsByStash, prices, itemOverrides, () => props.category)
const { filteredItemRecord } = useFilterShopItems(items, filterModel)

// GETTERS
const chaosValue = useAggregateItemPrice(filteredItemRecord, () => props.offerMultiplier ?? 1)
const divValue = useChaosToDiv(chaosValue, chaosPerDiv)

// METHODS

/**
 * Synchronize the items in the selected folders.
 */
async function syncSelectedFolders(items: PoeItemsByStash) {
	console.log({ items })
	await updateItemsByStash(items)
}
</script>

<style scoped>
.o-stash-tab-items {
	border-radius: var(--border-radius-medium);
	padding: 1rem;
	display: grid;
	grid-template-rows: auto auto 1fr auto;
	overflow: hidden;
	isolation: isolate;
}

.maybe-filter {
	z-index: 1;
}

.total-value {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 2rem;
}
</style>
