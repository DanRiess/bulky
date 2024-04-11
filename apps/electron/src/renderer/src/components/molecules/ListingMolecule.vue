<template>
	<div class="m-listing-item radial-gradient" data-b-override>
		<div class="flow">
			<ListingMetadataMolecule
				:ign="computedListing.ign"
				:chaos-per-div="computedListing.chaosPerDiv"
				:multiplier="computedListing.multiplier" />
			<ButtonAtom background-color="dark" @click="sendMessage">
				<template v-if="messageSent">
					<div class="message-sent">
						Message Sent!
						<SvgIconAtom name="done" height="24" color="var(--color-blue-bright)" />
					</div>
				</template>
				<template v-else>Whisper Player</template>
			</ButtonAtom>
		</div>

		<ListingItemsMolecule
			:full-buyout-watcher="computedListing.fullBuyoutWatcher"
			:computed-item-display-values="computedListing.computedItems"
			:total-price="computedListing.totalPrice" />
	</div>
</template>

<script setup lang="ts">
import ListingMetadataMolecule from './ListingMetadataMolecule.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { craftWhisperMessage } from '@web/utility/whisper'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { ref } from 'vue'
import ListingItemsMolecule from './ListingItemsMolecule.vue'
import { ComputedListingDisplayValues } from '@shared/types/bulky.types'

const messageSent = ref(false)

const props = defineProps<{
	computedListing: ComputedListingDisplayValues
}>()

async function sendMessage() {
	const message = craftWhisperMessage(props.computedListing)
	const response = await window.api.typeInChat(message)
	if (response) {
		messageSent.value = true
		setTimeout(() => {
			messageSent.value = false
		}, 60000)
	}
}
</script>

<style scoped>
.m-listing-item {
	display: grid;
	grid-template-columns: 15ch 1fr;
	gap: 1.5rem;
	padding: 0.5rem;
	border-radius: var(--border-radius-medium);
	/* transition: margin-top 1s cubic-bezier(0, 0, 0.85, 1); */
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
