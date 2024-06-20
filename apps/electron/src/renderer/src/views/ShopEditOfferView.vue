<template>
	<DefaultLayout grid-template-columns="minmax(350px, 0.5fr) minmax(450px, 1fr)">
		<template #leftColumn>
			<div class="stash-list flow">
				<div class="category-input">Category: {{ offer?.category }}</div>

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
				<StashTabItemsOrganism :offer-multiplier="multiplier" :edit-offer="true" />
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { BulkyItem, BulkyOffer } from '@shared/types/bulky.types'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import ShopCreateOfferConfigMolecule from '@web/components/molecules/ShopCreateOfferConfigMolecule.vue'
import StashTabCollectionOrganism from '@web/components/organisms/StashTabCollectionOrganism.vue'
import StashTabItemsOrganism from '@web/components/organisms/StashTabItemsOrganism.vue'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'
import { useShopStore } from '@web/stores/shopStore'
import { useStashStore } from '@web/stores/stashStore'
import { computed, ref } from 'vue'

// STORES
const stashStore = useStashStore()
const shopStore = useShopStore()

// PROPS
const props = defineProps<{
	uuid: BulkyOffer['uuid']
}>()

console.log({ props })

// EMITS
const emit = defineEmits<{
	editOffer: [ign: string, multiplier: number, fullBuyout: boolean, minBuyout: number, items: BulkyItem[]]
}>()

// STATE
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

// GETTERS
const offer = computed(() => shopStore.getOfferByUuid(props.uuid))
const minBuyoutDivValue = useChaosToDiv(() => offer.value?.minimumBuyout ?? 1, offer.value?.chaosPerDiv ?? 0)

// MODEL VALUES

/** Offer multiplier model value. */
const multiplier = ref(offer.value?.multiplier ?? 1)
/** Offer ign model value. Fetch from localstorage if available. */
const ign = ref(offer.value?.ign ?? '')
/** Offer minimum buyout model value. */
const minBuyout = ref(minBuyoutDivValue.value)
/** Offer full buyout model value */
const fullBuyout = ref(offer.value?.fullBuyout ?? false)

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
