<template>
	<div class="m-shop-offer-create-button">
		<template v-if="authStore.isLoggedIn && categories.length > 0">
			<ButtonAtom @click="router.push({ name: 'CreateOffer' })" :disabled="shopStore.maximumOffersReached">
				<template v-if="shopStore.maximumOffersReached">Maximum {{ maximumAllowedOffers }} Offers Allowed</template>
				<template v-else>Create New Offer</template>
			</ButtonAtom>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@web/stores/authStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { useShopStore } from '@web/stores/shopStore'
import { computed } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { CATEGORY } from '@shared/types/bulky.types'

// STORES
const authStore = useAuthStore()
const shopStore = useShopStore()

// STATE
const router = useRouter()
const maximumAllowedOffers = parseInt(import.meta.env.VITE_MAXIMUM_OFFER_AMOUNT)

// GETTERS

/**
 * Only one offer per category is allowed.
 * If there are no more available categories, the UI should remove the option to generate a new offer.
 */
const categories = computed(() => {
	const availableCategories = getKeys(CATEGORY)
	const usedCategories = shopStore.offers.map(o => o.category)
	return availableCategories.filter(el => !usedCategories.includes(el))
})
</script>

<style scoped>
.m-shop-offer-create-button {
	width: max-content;
	margin-inline: auto;
}
</style>
