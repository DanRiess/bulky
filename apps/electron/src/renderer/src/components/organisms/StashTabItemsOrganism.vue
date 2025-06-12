<template>
	<div class="o-stash-tab-items flow animated-gradient-background" data-b-override>
		<LoadStashTabsMolecule @sync-folders="syncSelectedFolders" />

		<div class="maybe-filter">
			<TransitionAtom v-on="transitionHooks">
				<ShopCreateOfferFilter v-if="category === 'MAP'" v-model="filterModel" :category="category" />
			</TransitionAtom>
		</div>

		<component
			:is="currentStashListComponent"
			:items="filteredItemRecord"
			:override-prices="itemOverrides"
			:sort-fn="sortItems"
			:offer-multiplier="offerMultiplier"
			@change-item-override="(item: ShopItemOrOverrideInstance, options: BulkyItemOverrideOptions) => putItemOverride(item, options)" />

		<div class="total-value">
			<PriceAtom
				:price="divValue"
				:label="category === 'EXPEDITION' ? 'Total Value (excluding logbooks):' : 'Total Value:'" />
			<template v-if="operation === 'create'">
				<ButtonAtom background-color="dark" @click="generateOffer" :disabled="disableOfferGenerationButton">
					Generate Offer
				</ButtonAtom>
			</template>
			<template v-else-if="operation === 'edit'">
				<ButtonAtom background-color="dark" @click="syncChanges">Sync Changes</ButtonAtom>
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
import {
	BulkyItemOverrideInstance,
	BulkyItemOverrideOptions,
	BulkyShopItem,
	BulkyShopItemRecord,
	Category,
	ShopFilter,
} from '@shared/types/bulky.types'
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
import { computed } from 'vue'
import StashItemListMoleculeExpedition from '../molecules/StashItemListMoleculeExpedition.vue'
import { replaceExpeditionLogbooks } from '@web/utility/replaceExpeditionLogbooks'
import { ShopExpeditionItem } from '@web/categories/expedition/expedition.types'
import { useNinjaStore } from '@web/stores/ninjaStore'

type ShopItemOrOverrideInstance = {
	shopItem?: BulkyShopItem
	overrideInstance?: BulkyItemOverrideInstance
}

// COMPONENTS
const currentStashListComponent = computed(() => {
	if (props.category === 'MAP') return StashItemListMoleculeMap
	else if (props.category === 'MAP_8_MOD') return StashItemListMolecule8ModMap
	else if (props.category === 'EXPEDITION') return StashItemListMoleculeExpedition
	else return StashItemListMolecule
})

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
const ninjaStore = useNinjaStore()

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
const { prices } = usePoeNinja(() => props.category)
const { itemOverrides, putItemOverride } = useItemOverrides(() => props.category)
const { items, sortItems } = useBulkyItems(categoryFilteredItemsByStash, prices, itemOverrides, () => props.category)
const { filteredItemRecord } = useFilterShopItems(items, filterModel)

// GETTERS
const chaosValue = useAggregateItemPrice(filteredItemRecord, () => props.offerMultiplier ?? 1)
const divValue = useChaosToDiv(chaosValue, ninjaStore.chaosPerDiv)

// METHODS

/**
 * Synchronize the items in the selected folders.
 */
async function syncSelectedFolders(items: PoeItemsByStash) {
	await updateItemsByStash(items)
}

/**
 * Apply category specific filtering to the items and emit to generate an offer.
 */
function generateOffer() {
	// Replace generic with faction specific logbooks
	if (props.category === 'EXPEDITION') {
		const itemRecord = replaceExpeditionLogbooks(
			filteredItemRecord.value as BulkyShopItemRecord<ShopExpeditionItem>,
			itemOverrides
		)
		emit('generateOffer', itemRecord, filterModel.value)
		return
	}

	emit('generateOffer', filteredItemRecord.value, filterModel.value)
}

/**
 * Apply category specific filtering to the items and emit to sync changes.
 */
function syncChanges() {
	// Replace generic with faction specific logbooks
	if (props.category === 'EXPEDITION') {
		const itemRecord = replaceExpeditionLogbooks(
			filteredItemRecord.value as BulkyShopItemRecord<ShopExpeditionItem>,
			itemOverrides
		)
		emit('syncChanges', itemRecord)
		return
	}

	emit('syncChanges', filteredItemRecord.value)
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
