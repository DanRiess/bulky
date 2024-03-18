<template>
	<div class="m-sell-listing radial-gradient" data-b-override>
		<p>Sorry, there are no active sales to be shown.</p>
		<div>
			<ButtonAtom background-color="dark" @click="appStateStore.selectedSellView = 'ADD'">
				Create a Sales Listing
			</ButtonAtom>
		</div>
	</div>
</template>

<script setup lang="ts">
import ButtonAtom from '@web/components/atoms/ButtonAtom.vue'
import { useAppStateStore } from '@web/stores/appStateStore'

// STORES
const appStateStore = useAppStateStore()
</script>

<style scoped>
.m-sell-listing {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
	display: grid;
	gap: 1rem;
	transform-origin: left;
}
</style>
