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

				<StashTabCollectionOrganism :show-refresh-button="timeout <= 0" @start-timeout="updateTimeout" />

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
					:offer-multiplier="multiplier"
					@generate-offer="generateOffer"
					:disable-offer-generation-button="disableOfferGenerationButton" />
				<!-- <div class="buttons">
					<ButtonAtom>Back To My Shop</ButtonAtom>
				</div> -->
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { BulkyItem, BulkyItemRecord, BulkyOffer, CATEGORY } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import LabelWithSelectMolecule from '@web/components/molecules/LabelWithSelectMolecule.vue'
import ShopCreateOfferConfigMolecule from '@web/components/molecules/ShopCreateOfferConfigMolecule.vue'
import StashTabCollectionOrganism from '@web/components/organisms/StashTabCollectionOrganism.vue'
import StashTabItemsOrganism from '@web/components/organisms/StashTabItemsOrganism.vue'
import { useAggregateItemPrice } from '@web/composables/useAggregateItemPrice'
import { usePoeNinja } from '@web/composables/usePoeNinja'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useAuthStore } from '@web/stores/authStore'
import { useConfigStore } from '@web/stores/configStore'
import { useShopStore } from '@web/stores/shopStore'
import { useStashStore } from '@web/stores/stashStore'
import { deepToRaw } from '@web/utility/deepToRaw'
import { BULKY_UUID } from '@web/utility/uuid'
import { UnwrapRef, ref } from 'vue'
import { useRouter } from 'vue-router'

// STORES
const authStore = useAuthStore()
const appStateStore = useAppStateStore()
const configStore = useConfigStore()
const stashStore = useStashStore()
const shopStore = useShopStore()

// STATE
const categories = getKeys(CATEGORY)
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())
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

// METHODS

/**
 * Update the timeout value and call this function recursively after 1 second until the timeout is 0.
 */
function updateTimeout() {
	timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

	// Don't actually use setInterval, it has some weird edge cases in which it doesn't use the delay at all.
	if (timeout.value > 0) {
		setTimeout(() => {
			updateTimeout()
		}, 1000)
	}
}

/**
 * Custom model value update function for the ign model.
 * In addition to the changes to the variable, also save it to local storage.
 */
function updateIgn(val: string) {
	ign.value = val
	window.localStorage.setItem('ign', val)
}

async function generateOffer(itemRecord: BulkyItemRecord) {
	disableOfferGenerationButton.value = true

	// TODO: Handle errors
	if (!authStore.profile?.name) {
		console.log('You have to sign in before creating a new offer')
		disableOfferGenerationButton.value = false
		return
	}

	if (!ign.value) {
		console.log('Ign is required')
		disableOfferGenerationButton.value = false
		return
	}

	const items: UnwrapRef<BulkyItem>[] = []

	itemRecord.forEach(item => {
		if (!item.selected) return
		items.push(deepToRaw(item))
	})

	const fullPrice = useAggregateItemPrice(itemRecord, multiplier.value, chaosPerDiv)
	const stashTabIds = stashStore.selectedStashTabs.map(t => t.id)

	const offer: BulkyOffer = {
		uuid: BULKY_UUID.generateTypedUuid<BulkyOffer>(),
		user: authStore.profile.name,
		ign: ign.value,
		stashTabIds,
		multiplier: multiplier.value,
		minimumBuyout: Math.round(minBuyout.value.divine * chaosPerDiv.value + minBuyout.value.chaos),
		fullBuyout: fullBuyout.value,
		chaosPerDiv: chaosPerDiv.value,
		category: appStateStore.selectedCategory,
		league: configStore.config.league,
		items,
		lastUploaded: 0,
		fullPrice: fullPrice.value,
		active: false,
		autoSync: true,
	}

	await shopStore.putOffer(offer)

	disableOfferGenerationButton.value = false

	router.push({ name: 'Shop' })
}
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
