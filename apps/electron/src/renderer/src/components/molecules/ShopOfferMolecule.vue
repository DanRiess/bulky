<template>
	<div class="m-shop-offer">
		<div class="metadata">
			<div class="ign">{{ offer.ign }}</div>
			<div class="full-price">{{ offer.fullPrice }}</div>
		</div>
		<div class="items">Items</div>
		<div class="actions">Some actions</div>
	</div>
</template>

<script setup lang="ts">
import { BulkyOffer } from '@shared/types/bulky.types'

// PROPS
defineProps<{
	offer: BulkyOffer
}>()

// GETTERS
</script>
