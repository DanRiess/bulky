<template>
	<div class="o-bazaar-offer animated-gradient-background" data-b-override>
		<div class="metadata-and-whisper flow">
			<BazaarOfferMetadataMolecule :offer="offer" />
			<ButtonAtom background-color="dark" @click="sendMessage">
				<template v-if="offer.contact.messageSent">
					<div class="message-sent">
						Message Sent!
						<SvgIconAtom name="done" height="24" color="var(--color-blue-bright)" />
					</div>
				</template>
				<template v-else>Whisper Player</template>
			</ButtonAtom>
		</div>

		<div class="items-and-price">
			<BazaarOfferItemsMolecule :filter="filter" :items="filteredItems" :price="filteredPrice" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { craftWhisperMessage } from '@web/utility/whisper'
import { BulkyBazaarItem, BulkyBazaarOffer, BulkyFilter, TotalPrice } from '@shared/types/bulky.types'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import BazaarOfferMetadataMolecule from '../molecules/BazaarOfferMetadataMolecule.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import BazaarOfferItemsMolecule from '../molecules/BazaarOfferItemsMolecule.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { computed } from 'vue'
import { ComputedBulkyOfferStore } from '@shared/types/bulky.types'

// PROPS
const props = defineProps<{
	offer: BulkyBazaarOffer
	filter: BulkyFilter
	priceComputeFn: ComputedBulkyOfferStore['calculateItemBasePrice']
}>()

// GETTERS

/** Filter the offer's items based on the filter */
const filteredItems = computed<BulkyBazaarItem[]>(() => {
	// If the user wants to buy the full offer, return all items
	if (props.filter.fullBuyout) {
		return props.offer.items
	}

	return props.offer.items.filter(item => {
		return props.filter.fields.find(field => field.type === item.type && field.tier === item.tier)
	})
})

/** Calculate the price of the filtered items. */
const filteredPrice = computed<TotalPrice>(() => {
	const t0 = performance.now()
	// If 'fullBuyout' is chosen, return the offer's full price.
	// Else, calculate the filtered items price.
	const chaosValue = props.filter.fullBuyout
		? props.offer.fullPrice
		: filteredItems.value.reduce((prev, curr) => {
				try {
					const basePrice = props.priceComputeFn(curr, props.filter)

					// If 'alwaysMaxQuantity' is picked, just return the items price * quantity.
					if (props.filter.alwaysMaxQuantity) {
						return (prev += basePrice * curr.quantity)
					}

					// Find the filter field that corresponds to the item and return its quantity * the items price.
					const field = props.filter.fields.find(field => field.type === curr.type && field.tier === curr.tier)
					if (!field) {
						return prev
					}

					return (prev += basePrice * field.quantity)
				} catch (e) {
					return prev
				}
		  }, 0)

	console.log(`Compute filtered price performance: ${performance.now() - t0}`)

	return {
		divine: Math.floor(chaosValue / props.offer.chaosPerDiv),
		chaos: chaosValue % props.offer.chaosPerDiv,
	}
})

// METHODS

/**
 * Create a whisper message and instruct Node to send it ingame.
 */
async function sendMessage() {
	const message = craftWhisperMessage(props.offer)

	const request = useApi('typeInChat', nodeApi.typeInChat)
	await request.exec(message)

	if (request.data.value) {
		props.offer.contact.messageSent = true
		setTimeout(() => {
			props.offer.contact.messageSent = false
		}, 60000)
	}
}
</script>

<style scoped>
.o-bazaar-offer {
	display: grid;
	grid-template-columns: 17ch 1fr;
	gap: 1.5rem;
	padding: 0.5rem;
	border-radius: var(--border-radius-medium);
	/* transition: margin-top 1s cubic-bezier(0, 0, 0.85, 1); */
}

.price {
	float: right;
	margin-top: 0.5rem;
	margin-right: 5px;
}

.message-sent {
	display: flex;
	text-wrap: nowrap;
	gap: 0.5rem;
	/* color: transparent;
	font-weight: 600;
	background: linear-gradient(
			90deg,
			var(--color-stop-2, var(--dr-gradient-to-bright, #dc00fe)),
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9))
		)
		border-box;
	background-clip: text; */
	color: var(--color-blue-bright);
}
</style>
