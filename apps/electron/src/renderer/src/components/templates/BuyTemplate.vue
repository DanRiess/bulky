<template>
	<main class="t-buy">
		<div class="main-container flow">
			<CategoryMolecule />
			<BuyListingsOrganism :listings="listings" />
		</div>
		<div class="main-container">
			<TransitionAtom v-on="fadeHooks">
				<FilterOrganism
					v-if="filterProps"
					:filter="filterProps.filter"
					:main-options="filterProps.mainOptions"
					:secondary-options="filterProps.secondaryOptions"
					@add-filter-field="filterProps.addFilterField"
					@remove-filter-field="filterProps.removeFilterField" />
			</TransitionAtom>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@web/stores/appStateStore'
import { watch } from 'vue'
import FilterOrganism from '../organisms/FilterOrganism.vue'
import BuyListingsOrganism from '../organisms/BuyListingsOrganism.vue'
import CategoryMolecule from '../molecules/CategoryMolecule.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import { useEssenceListingStore } from '@web/categories/essence/essenceListing.store'
import { useCompassListingStore } from '@web/categories/compass/compassListing.store'
import { useListingProps } from '@web/composables/listingProps'
import { useFilterProps } from '@web/composables/filterProps'
import { encodeArrayBufferToUrlSafeBase64 } from '@web/utility/arrayBufferBase64'
import { SEXTANT_MODIFIER_NAME_TO_IDX, SEXTANT_TIER_NAME_TO_IDX } from '@web/categories/compass/compass.const'
import { getEntries } from '@shared/types/utility.types'

// STORES
const appStateStore = useAppStateStore()
const essenceListingStore = useEssenceListingStore()
const compassListingStore = useCompassListingStore()

const listings = useListingProps()
const filterProps = useFilterProps()

// WATCHERS
watch(
	() => appStateStore.selectedCategory,
	cat => {
		if (cat === 'ESSENCE') {
			essenceListingStore.getTestData()
		} else if (cat === 'COMPASS') {
			compassListingStore.getTestData()
		}

		// makeBinTestData()
	}
)

function makeBinTestData() {
	console.log('MAKE BIN TEST')
	let ab: ArrayBuffer
	compassListingStore.listings.forEach(listing => {
		console.log(listing)
		const items = getEntries(listing.items)
		// this will be wrong because tiers are nested
		const itemLength = items.length
		ab = new ArrayBuffer(11 + itemLength * 8)
		const dv = new DataView(ab)

		// "BCF "
		dv.setUint8(0, 66)
		dv.setUint8(1, 67)
		dv.setUint8(2, 70)
		dv.setUint8(3, 32)

		// Version
		dv.setUint8(4, 1)

		// item length
		dv.setUint16(5, itemLength, true)

		// data identifier
		dv.setUint8(7, 68)
		dv.setUint8(8, 65)
		dv.setUint8(9, 84)
		dv.setUint8(10, 65)

		let offset = 11

		items.forEach(item => {
			console.log({ item })
			if (!item || !item[1] || !item[0]) return
			const name = item[0]
			const typeArray = item[1]
			typeArray.forEach(nestedItem => {
				const nameIdx = SEXTANT_MODIFIER_NAME_TO_IDX[name]
				const tierIdx = SEXTANT_TIER_NAME_TO_IDX[nestedItem.tier]

				dv.setUint8(offset, nameIdx)
				dv.setUint8(offset + 1, tierIdx)
				dv.setUint16(offset + 2, nestedItem.quantity, true)
				dv.setUint16(offset + 4, nestedItem.price, true)
				dv.setUint8(offset + 6, 66)
				dv.setUint8(offset + 7, 82)

				offset += 8
			})
		})
		console.log(ab)

		const b64 = encodeArrayBufferToUrlSafeBase64(ab)
		console.log({ b64 })
	})

	// function base64ToArrayBuffer(base64) {
	// 	var binaryString = atob(base64)
	// 	var bytes = new Uint8Array(binaryString.length)
	// 	for (var i = 0; i < binaryString.length; i++) {
	// 		bytes[i] = binaryString.charCodeAt(i)
	// 	}
	// 	return bytes.buffer
	// }

	// console.log(base64ToArrayBuffer(b64))
}

// HOOKS
const fadeHooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.35,
})
</script>

<style scoped>
.t-buy {
	display: grid;
	grid-template-columns: minmax(450px, 1.5fr) minmax(450px, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 2rem;
	margin-top: 1rem;
	transform-origin: top;
}

.main-container {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
}
</style>
