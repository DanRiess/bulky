<template>
	<div class="o-bazaar-offer animated-gradient-background" data-b-override>
		<div class="metadata-and-whisper flow">
			<BazaarOfferMetadataMolecule
				:ign="computedOffer.ign"
				:chaos-per-div="computedOffer.chaosPerDiv"
				:multiplier="computedOffer.multiplier" />
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

		<div class="items-and-price">
			<BazaarOfferItemsMolecule
				:full-buyout-watcher="computedOffer.fullBuyoutWatcher"
				:computed-item-display-values="computedOffer.computedItems" />
			<BazaarOfferCurrentPriceAtom :total-price="computedOffer.totalPrice" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { craftWhisperMessage } from '@web/utility/whisper'
import { ref } from 'vue'
import { ComputedOfferDisplayValues } from '@shared/types/bulky.types'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import BazaarOfferMetadataMolecule from '../molecules/BazaarOfferMetadataMolecule.vue'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import BazaarOfferItemsMolecule from '../molecules/BazaarOfferItemsMolecule.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import BazaarOfferCurrentPriceAtom from '../atoms/BazaarOfferCurrentPriceAtom.vue'

const messageSent = ref(false)

const props = defineProps<{
	computedOffer: ComputedOfferDisplayValues
}>()

async function sendMessage() {
	const message = craftWhisperMessage(props.computedOffer)

	const request = useApi('typeInChat', nodeApi.typeInChat)
	await request.exec(message)

	if (request.data.value) {
		messageSent.value = true
		setTimeout(() => {
			messageSent.value = false
		}, 60000)
	}
}
</script>

<style scoped>
.o-bazaar-offer {
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
