<template>
	<div class="m-notification-regex animated-gradient-background" data-b-override>
		<div class="message">
			<p>
				Trade request from <span class="highlight">{{ ign }}</span>
			</p>
			<p>Category: {{ data.category }}</p>
			<p>{{ data.quantity }} x {{ data.type }} {{ data.tier }} for {{ data.price }}c</p>
		</div>
		<div class="buttons">
			<SvgButtonWithPopupMolecule
				:svg-props="{ name: 'regex' }"
				:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }">
				Copy Regex
			</SvgButtonWithPopupMolecule>
			<SvgButtonWithPopupMolecule
				:svg-props="{ name: 'trash' }"
				:tooltip-props="{ position: 'bottom', popupAlignment: 'right', transitionDirection: 'toBottom' }">
				Remove permanently
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

// PROPS
const props = defineProps<{
	ign: string
	encodedMessage: string
}>()

// GETTERS

/**
 * Decode and translate the provided message.
 * Format: Number 1, 2: category; Number 3, 4, 5: ItemType; Number 6, 7, 8: ItemTier; Number 9, 10, 11: Price;
 * 			Numbers until the separator %RX%: Amount; Separator: %RX%; Rest: Regex
 */
const data = computed(() => {
	try {
		const parts = atob(props.encodedMessage).split('%RX%')
		if (parts.length !== 2) {
			throw new Error()
		}

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

		return { category: BULKY_TRANSFORM.stringToDisplayValue(category), type, tier, price, quantity, regex }
	} catch (e) {
		return {
			category: 'Unknown',
			type: '',
			tier: '',
			price: NaN,
			quantity: NaN,
			regex: '',
		}
	}
})
</script>

<style scoped>
.m-notification-regex {
	min-height: 2rem;
	width: 100%;
	border-radius: var(--border-radius-small);
	display: grid;
	grid-template-columns: 1fr max-content;
	gap: 0.5rem;
	font-size: 0.85rem;
	pointer-events: all;
	padding: 0.25rem 0.5rem;
}

.highlight {
	color: var(--color-success);
}

.buttons {
	display: flex;
	gap: 0.25rem;
	align-items: center;
}
</style>
