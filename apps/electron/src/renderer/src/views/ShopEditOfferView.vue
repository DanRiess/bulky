<template>
	<DefaultLayout grid-template-columns="minmax(350px, 0.5fr) minmax(450px, 1fr)" v-if="offer">
		<template #leftColumn>
			<div class="stash-list flow">
				<div class="category-input">
					<span>Category:</span>
					<ImgCategoryAtom :category="offer.category" />
					<span>{{ capitalize(offer.category) }}</span>
				</div>

				<StashTabCollectionOrganism />

				<ShopCreateOfferConfigMolecule
					v-model:ign="offer.ign"
					@update:ign="updateIgn"
					v-model:multiplier="offer.multiplier"
					v-model:full-buyout="offer.fullBuyout"
					v-model:min-buyout="offer.minimumBuyout" />
			</div>
		</template>

		<template #rightColumn>
			<div class="item-collection flow">
				<StashTabItemsOrganism
					operation="edit"
					:category="offer.category"
					:offer-multiplier="offer.multiplier"
					@sync-changes="syncChanges" />
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { BulkyShopItem, BulkyShopItemRecord, BulkyShopOffer } from '@shared/types/bulky.types'
import ImgCategoryAtom from '@web/components/atoms/ImgCategoryAtom.vue'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import ShopCreateOfferConfigMolecule from '@web/components/molecules/ShopCreateOfferConfigMolecule.vue'
import StashTabCollectionOrganism from '@web/components/organisms/StashTabCollectionOrganism.vue'
import StashTabItemsOrganism from '@web/components/organisms/StashTabItemsOrganism.vue'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { useShopStore } from '@web/stores/shopStore'
import { useStashStore } from '@web/stores/stashStore'
import { deepToRaw } from '@web/utility/deepToRaw'
import { capitalize } from 'lodash'
import { UnwrapRef, onBeforeMount, ref, toValue } from 'vue'
import { useRouter } from 'vue-router'

// STORES
const stashStore = useStashStore()
const shopStore = useShopStore()

// PROPS
const props = defineProps<{
	uuid: BulkyShopOffer['uuid']
}>()

// STATE
const router = useRouter()
const offer = ref(shopStore.getOfferByUuid(props.uuid))

// METHODS

/**
 * Custom model value update function for the ign model.
 * In addition to the changes to the variable, also save it to local storage.
 */
function updateIgn(val: string) {
	window.localStorage.setItem('ign', val)
}

async function syncChanges(itemRecord: BulkyShopItemRecord) {
	if (offer.value) {
		const items: UnwrapRef<BulkyShopItem>[] = []
		let computedMultiplier = offer.value.multiplier

		itemRecord.forEach(item => {
			if (!item.selected) return
			items.push(deepToRaw(item))

			// calculate the multiplier for this item
			const itemMultiplier = toValue(item.priceOverride) / toValue(item.price)
			if (toValue(item.price) !== 0 && itemMultiplier > computedMultiplier) {
				computedMultiplier = itemMultiplier
			}
		})

		const fullPrice = useAggregateItemPrice(itemRecord, offer.value.multiplier)
		const stashTabIds = stashStore.selectedStashTabs.map(t => t.id)

		offer.value.stashTabIds = stashTabIds
		offer.value.items = items
		offer.value.fullPrice = fullPrice.value
		offer.value.computedMultiplier = computedMultiplier

		await shopStore.putOffer(offer.value)
	}
	router.push({ name: 'Shop' })
}

// LIFECYCLE

onBeforeMount(() => {
	// TODO: handle error
	if (!offer.value) {
		console.log('Offer not found')
		return
	}

	// Unselect all stash tabs and select the ones from the offer
	stashStore.unselectAll()
	offer.value.stashTabIds.forEach(id => {
		const tab = stashStore.getStashTabById(id)
		if (!tab) return
		tab.selected = true
	})
})
</script>

<style scoped>
.item-collection {
	display: grid;
	/* grid-template-rows: auto minmax(0, max-content); */
	overflow: hidden;
}

/* override for the stash list */
.stash-list {
	display: grid;
	grid-template-rows: 2rem 1fr;
	overflow: hidden;
}

.category-input {
	display: grid;
	grid-template-columns: max-content 1.5rem 1fr;
	gap: 0.5rem;
	user-select: none;
}

.timeout {
	text-align: right;
	font-size: 0.8rem;
}

.buttons {
	display: flex;
	justify-content: flex-end;
}
</style>
