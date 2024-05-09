<template>
	<div class="o-sell-listings flow animated-gradient-background" data-b-override>
		<ul class="">
			<TransitionAtom group v-on="hooks">
				<FallbackSellListingMolecule v-if="listings.length === 0" />
			</TransitionAtom>
		</ul>
		<div class="button">
			<template v-if="authStore.isLoggedIn">
				<ButtonAtom background-color="dark" @click="router.push('CreateOffer')"> Create New Sales Listing </ButtonAtom>
			</template>
			<template v-else>
				<ButtonAtom background-color="dark" @click="initializeSignIn">
					Sign in with your PoE account to add a new listing {{ authStore.isLoggedIn }}
				</ButtonAtom>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import FallbackSellListingMolecule from '../molecules/fallbacks/FallbackSellListingMolecule.vue'
import { useAuthStore } from '@web/stores/authStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { useRouter } from 'vue-router'

// STORES
const authStore = useAuthStore()

// STATE
const router = useRouter()
const listings = []

// METHODS
function initializeSignIn() {
	router.push({ name: 'Auth' })
}

// HOOKS
const hooks = useGenericTransitionHooks({
	opacity: 0,
	transform: 'scaleX(0.01)',
	duration: 0.45,
})
</script>

<style scoped>
.o-sell-listings {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
	display: grid;
	gap: 1rem;
	transform-origin: left;
}
</style>
