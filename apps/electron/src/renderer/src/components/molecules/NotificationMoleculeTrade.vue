<template>
	<div class="m-notification-regex animated-gradient-background" data-b-override>
		<div class="message">
			<p>
				Trade request from <span class="highlight">{{ notification.ign }}</span>
			</p>
			<p>Category: {{ mtn.category }}</p>
			<p>
				League:
				<span :class="{ error: notification.league !== configStore.config.league }">{{ notification.league }}</span>
			</p>
			<p v-for="trade in mtn.trades" :key="trade">{{ trade }}</p>
			<PriceAtom
				:price="totalPrice"
				v-if="typeof totalPrice !== 'number' && (mtn.trades.length > 0 || mtn.trades[0] === 'Full Offer')" />
			<p v-else-if="typeof totalPrice === 'number'">
				Full Price: {{ totalPrice }} c. <span class="error">(League mismatch: incorrect chaos/div ratio!)</span>
			</p>
		</div>
		<div class="buttons">
			<div class="button-group">
				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'addPerson' }"
					:tooltip-props="{ position: 'bottom', popupAlignment: 'left', transitionDirection: 'toBottom' }"
					@click="chatBoxAction('invite')">
					Invite {{ notification.ign }} to your party
				</SvgButtonWithPopupMolecule>
				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'exchange' }"
					:tooltip-props="{ position: 'bottom', popupAlignment: 'left', transitionDirection: 'toBottom' }"
					@click="chatBoxAction('tradewith')">
					Trade with {{ notification.ign }}
				</SvgButtonWithPopupMolecule>
				<SvgButtonWithPopupMolecule
					:svg-props="{ name: 'done' }"
					:tooltip-props="{ position: 'bottom', popupAlignment: 'left', transitionDirection: 'toBottom' }"
					@click="chatBoxAction('kick')">
					Trade complete
				</SvgButtonWithPopupMolecule>
			</div>
			<SvgButtonWithPopupMolecule
				v-if="mtn.regex"
				:svg-props="{ name: 'regex' }"
				:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }"
				@click="copyAndUseRegex">
				Copy Regex
			</SvgButtonWithPopupMolecule>
			<SvgButtonWithPopupMolecule
				:svg-props="{ name: 'trash' }"
				:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }"
				@click="notificationStore.remove(props.notification)">
				Remove trade request
			</SvgButtonWithPopupMolecule>
		</div>
	</div>
</template>

<script setup lang="ts">
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import { TradeNotification } from '@shared/types/general.types'
import { useNotificationStore } from '@web/stores/notificationStore'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import { sleepTimer } from '@web/utility/sleep'
import { useChaosToDiv } from '@web/composables/useChaosToDiv'
import PriceAtom from '../atoms/PriceAtom.vue'
import { decodeMinifiedTradeNotification } from '@web/utility/minifiedTradeNotification'
import { useNinjaStore } from '@web/stores/ninjaStore'
import { useConfigStore } from '@web/stores/configStore'

// STORES
const notificationStore = useNotificationStore()
const configStore = useConfigStore()

// PROPS
const props = defineProps<{
	notification: TradeNotification
	idx: number
}>()

// STATE
console.log(props.notification)
const mtn = decodeMinifiedTradeNotification(props.notification.tradeData)

// COMPOSABLES
const { chaosPerDiv } = useNinjaStore()
const totalPrice =
	props.notification.league === configStore.config.league ? useChaosToDiv(mtn.fullPrice, chaosPerDiv) : mtn.fullPrice

// METHODS
async function chatBoxAction(command: 'invite' | 'tradewith' | 'kick') {
	const request = useApi('chatBoxAction', nodeApi.typeInChat)
	await request.exec(`/${command} ${props.notification.ign}`)

	if (command === 'kick') {
		await sleepTimer(100)
		await request.exec(`@${props.notification.ign} Thank you for the trade. Have a nice day!`)
		notificationStore.remove(props.notification)
	}
}

async function copyAndUseRegex() {
	if (!mtn.regex) return

	navigator.clipboard.writeText(mtn.regex)

	const request = useApi('pasteSearch', nodeApi.pasteSearch)
	await request.exec(mtn.regex)
}
</script>

<style scoped>
.m-notification-regex {
	width: 100%;
	border-radius: var(--border-radius-small);
	gap: 0.5rem;
	font-size: 0.85rem;
	pointer-events: all;
	padding: 0.25rem 0.5rem;
	z-index: v-bind('100' - idx);
}

.highlight {
	color: var(--color-success);
}

.error {
	color: var(--color-error);
}

.buttons {
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	margin-top: 0.25rem;
}

.button-group {
	display: flex;
	gap: 0.25rem;
}
</style>
