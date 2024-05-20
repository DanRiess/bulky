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

				<ShopOfferConfigMolecule />
			</div>
		</template>
		<template #rightColumn>
			<div class="item-collection flow">
				<StashTabItemsOrganism />
				<div class="buttons">
					<ButtonAtom>Back To My Shop</ButtonAtom>
				</div>
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { CATEGORY } from '@shared/types/bulky.types'
import { getKeys } from '@shared/types/utility.types'
import ButtonAtom from '@web/components/atoms/ButtonAtom.vue'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import LabelWithSelectMolecule from '@web/components/molecules/LabelWithSelectMolecule.vue'
import ShopOfferConfigMolecule from '@web/components/molecules/ShopOfferConfigMolecule.vue'
import StashTabCollectionOrganism from '@web/components/organisms/StashTabCollectionOrganism.vue'
import StashTabItemsOrganism from '@web/components/organisms/StashTabItemsOrganism.vue'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useStashStore } from '@web/stores/stashStore'
import { computed, onMounted, ref } from 'vue'

// STORES
const appStateStore = useAppStateStore()
const stashStore = useStashStore()

// STATE
const categories = getKeys(CATEGORY)
const timeout = ref(stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

// GETTERS
const stashListGridRows = computed(() => {
	return timeout.value <= 0 ? '2rem calc(100% - 2rem) 0rem' : '2rem calc(100% - 3.5rem) 1.5rem'
})

// METHODS
function updateTimeout() {
	timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())

	// don't actually use setinterval, it has some weird edge cases in which it doesn't use the delay at all
	if (timeout.value > 0) {
		setTimeout(() => {
			updateTimeout()
		}, 1000)
	}
}

// LIFECYCLE
onMounted(() => {
	setInterval(() => {
		timeout.value = Math.max(0, stashStore.lastListFetch + stashStore.fetchTimeout - Date.now())
	}, 1000)
})
</script>

<style scoped>
/* .main-container {
	display: grid;
	grid-template-rows: auto minmax(0, max-content);
	transition: grid-template-rows 0.3s ease;
} */

.item-collection {
	display: grid;
	grid-template-rows: auto minmax(0, max-content);
	overflow: hidden;
}

/* override for the stash list */
.stash-list {
	display: grid;
	grid-template-rows: v-bind(stashListGridRows);
	grid-template-rows: 2rem 1fr max-content;
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
