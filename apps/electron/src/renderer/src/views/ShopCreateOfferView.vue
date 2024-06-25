<template>
	<DefaultLayout grid-template-columns="minmax(350px, 0.5fr) minmax(450px, 1fr)">
		<template #leftColumn>
			<div class="stash-list flow">
				<div class="category-input">
					<LabelWithSelectMolecule
						:options="categories"
						v-model="appStateStore.selectedCategory"
						background-color="light">
						Select Category:
					</LabelWithSelectMolecule>
				</div>

				<StashTabCollectionOrganism />

				<ShopCreateOfferConfigMolecule
					v-model:ign="ign"
					@update:ign="updateIgn"
					v-model:multiplier="multiplier"
					v-model:full-buyout="fullBuyout"
					v-model:min-buyout="minBuyout" />
			</div>
		</template>

		<template #rightColumn>
			<div class="item-collection flow">
				<StashTabItemsOrganism
					operation="create"
					:offer-multiplier="multiplier"
					:category="appStateStore.selectedCategory"
					:disable-offer-generation-button="disableOfferGenerationButton"
					@generate-offer="createOffer" />
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { BulkyShopItemRecord, CATEGORY } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import LabelWithSelectMolecule from '@web/components/molecules/LabelWithSelectMolecule.vue'
import ShopCreateOfferConfigMolecule from '@web/components/molecules/ShopCreateOfferConfigMolecule.vue'
import StashTabCollectionOrganism from '@web/components/organisms/StashTabCollectionOrganism.vue'
import StashTabItemsOrganism from '@web/components/organisms/StashTabItemsOrganism.vue'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useShopStore } from '@web/stores/shopStore'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

// STORES
const appStateStore = useAppStateStore()
const shopStore = useShopStore()

// STATE
const disableOfferGenerationButton = ref(false)

// COMPOSABLES
const { chaosPerDiv } = usePoeNinja(appStateStore.selectedCategory)
const router = useRouter()

// MODEL VALUES

/** Offer multiplier model value. */
const multiplier = ref(1)
/** Offer ign model value. Fetch from localstorage if available. */
const ign = ref(window.localStorage.getItem('ign') ?? '')
/** Offer minimum buyout model value. */
const minBuyout = ref({
	chaos: 0,
	divine: 0,
})
/** Offer full buyout model value */
const fullBuyout = ref(false)

// GETTERS
const categories = computed(() => {
	const availableCategories = getKeys(CATEGORY)
	const usedCategories = shopStore.offers.map(o => o.category)
	return availableCategories.filter(el => !usedCategories.includes(el))
})

// METHODS

/**
 * Custom model value update function for the ign model.
 * In addition to the changes to the variable, also save it to local storage.
 */
function updateIgn(val: string) {
	ign.value = val
	window.localStorage.setItem('ign', val)
}

/**
 * Call the generateOffer function from the store and provide some visual UI feedback while the offer is being uploaded.
 */
async function createOffer(itemRecord: BulkyShopItemRecord) {
	disableOfferGenerationButton.value = true

	if (!ign.value) {
		console.log('Ign is required')
		disableOfferGenerationButton.value = false
		return
	}

	// Generate a new offer.
	const offer = await shopStore.generateOffer(
		itemRecord,
		ign.value,
		chaosPerDiv.value,
		multiplier.value,
		minBuyout.value,
		fullBuyout.value
	)

	if (!offer) {
		// TODO: handle error
		console.log('did not generate offer')
		disableOfferGenerationButton.value = false
		return
	}

	// Upload the offer to the public db and save it to idb.
	await shopStore.putOffer(offer)

	disableOfferGenerationButton.value = false
	router.push({ name: 'Shop' })
}

// HOOKS
onBeforeMount(() => {
	if (!categories.value.includes(appStateStore.selectedCategory)) {
		appStateStore.selectedCategory = categories.value[0]
	}
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
	grid-template-columns: max-content 1fr;
	gap: 0.5rem;
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
