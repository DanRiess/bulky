<template>
	<div class="m-notification-regex animated-gradient-background" data-b-override>
		<div class="message">
			<p>
				Trade request from <span class="highlight">{{ notification.ign }}</span>
			</p>
			<p>Category: {{ trade.category }}</p>
			<p>{{ trade.quantity }} x {{ trade.type }} {{ trade.tier }} for {{ trade.price }}c</p>
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
				v-if="trade.regex"
				:svg-props="{ name: 'regex' }"
				:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }">
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
import { computed } from 'vue'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'
import { CATEGORY_IDX_TO_NAME } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { TradeNotification } from '@shared/types/general.types'
import { useNotificationStore } from '@web/stores/notificationStore'
import { useApi } from '@web/api/useApi'
import { nodeApi } from '@web/api/nodeApi'
import { sleepTimer } from '@web/utility/sleep'

// STORES
const notificationStore = useNotificationStore()

// PROPS
const props = defineProps<{
	notification: TradeNotification
	idx: number
}>()

// GETTERS

/**
 * Decode and translate the provided message.
 * Format: Number 1, 2: category; Number 3, 4, 5: ItemType; Number 6, 7, 8: ItemTier; Number 9, 10, 11: Price;
 * 			Numbers until the separator %RX%: Amount; Separator: %RX%; Rest: Regex
 */
const trade = computed(() => {
	try {
		const parts = props.notification.tradeData.split('%RX%')

		const numberPart = parts[0]
		const category = CATEGORY_IDX_TO_NAME[parseInt(numberPart.slice(0, 2))]
		const idxToTypeMap = BULKY_FACTORY.getIdxToNameTypeMap(category)
		const idxToTierMap = BULKY_FACTORY.getIdxToNameTierMap(category)
		if (!idxToTypeMap || !idxToTierMap) {
			throw new Error()
		}

		const type = BULKY_TRANSFORM.stringToDisplayValue(idxToTypeMap[parseInt(numberPart.slice(2, 5))])
		const tier =
			category === 'MAP_8_MOD'
				? idxToTierMap[parseInt(numberPart.slice(5, 8))].split('IER_').join('')
				: BULKY_TRANSFORM.stringToDisplayValue(idxToTierMap[parseInt(numberPart.slice(5, 8))])
		const price = parseInt(numberPart.slice(8, 11))
		const quantity = parseInt(numberPart.slice(11))
		const regex = parts[1]

		const categoryAddendum = category === 'MAP_8_MOD' ? (regex ? ' with Regex' : ' without Regex') : ''

		return { category: BULKY_TRANSFORM.stringToDisplayValue(category) + categoryAddendum, type, tier, price, quantity, regex }
	} catch (e) {
		return {
			category: 'Unknown',
			type: '',
			tier: '',
			price: NaN,
			quantity: NaN,
			regex: undefined,
		}
	}
})

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
