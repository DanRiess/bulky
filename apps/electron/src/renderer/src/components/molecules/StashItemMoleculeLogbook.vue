<template>
	<li class="m-stash-item" :style="style">
		<div class="metadata">
			<InputCheckboxAtom
				v-model="selected"
				@update:model-value="emit('changeItemOverride', { shopItem: item }, { selected })" />
			<div class="icon">
				<img :src="item.icon" :alt="item.name" />
			</div>
			<div class="name">{{ item.name }}</div>
			<div class="tier" v-if="showTier">{{ BULKY_TRANSFORM.stringToDisplayValue(item.tier) }}</div>
			<div class="stack-size">{{ item.quantity }}</div>
			<div></div>
			<div>-</div>
			<div class="stack-price">{{ stackPrice }}</div>
		</div>
		<AccordionTransitionWrapperAtom class="grid-column-3-8" :expanded="selected">
			<ul class="logbook-faction-prices">
				<LogbookFactionOptionAtom
					v-for="faction in EXPEDITION_FACTION"
					v-model="logbooks[faction]"
					:faction="faction"
					:tier="item.tier"
					:league="item.league"
					:overrides="overridePrices"
					:stack-size="computedLogbookStackSize[faction]"
					@update-override-value="item => emit('changeItemOverride', item, {})" />
			</ul>
		</AccordionTransitionWrapperAtom>
	</li>
</template>

<script setup lang="ts">
import {
	BulkyShopItem,
	BulkyItemOverrideOptions,
	BulkyItemOverrideRecord,
	BulkyItemOverrideInstance,
} from '@shared/types/bulky.types'
import { computed, ref, toValue, watch } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { ExpeditionFaction, ShopExpeditionItem } from '@web/categories/expedition/expedition.types'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import LogbookFactionOptionAtom from '../atoms/LogbookFactionOptionAtom.vue'
import { EXPEDITION_FACTION, EXPEDITION_FACTION_IDX_TO_NAME, EXPEDITION_TYPE } from '@web/categories/expedition/expedition.const'
import { getKeys } from '@shared/types/utility.types'

// PROPS
const props = defineProps<{
	item: ShopExpeditionItem
	overridePrices: BulkyItemOverrideRecord
	offerMultiplier: number | undefined
	showTier?: boolean
}>()

// EMITS
const emit = defineEmits<{
	changeItemOverride: [
		item: { shopItem?: BulkyShopItem; overrideInstance?: BulkyItemOverrideInstance },
		options: BulkyItemOverrideOptions
	]
}>()

// STATE
const selected = ref(props.item.selected)

const logbooks = ref<Record<ExpeditionFaction, BulkyItemOverrideInstance>>({
	DRUIDS_OF_THE_BROKEN_CIRCLE:
		props.overridePrices.get(`LOGBOOK_DRUIDS_OF_THE_BROKEN_CIRCLE_${props.item.tier}`) ??
		generateFactionLogbookOverrideInstance('DRUIDS_OF_THE_BROKEN_CIRCLE'),
	BLACK_SCYTHE_MERCENARIES:
		props.overridePrices.get(`LOGBOOK_BLACK_SCYTHE_MERCENARIES_${props.item.tier}`) ??
		generateFactionLogbookOverrideInstance('BLACK_SCYTHE_MERCENARIES'),
	KNIGHTS_OF_THE_SUN:
		props.overridePrices.get(`LOGBOOK_KNIGHTS_OF_THE_SUN_${props.item.tier}`) ??
		generateFactionLogbookOverrideInstance('KNIGHTS_OF_THE_SUN'),
	ORDER_OF_THE_CHALICE:
		props.overridePrices.get(`LOGBOOK_ORDER_OF_THE_CHALICE_${props.item.tier}`) ??
		generateFactionLogbookOverrideInstance('ORDER_OF_THE_CHALICE'),
})

// WATCHERS

/**
 * On load, the override prices are still being fetched from idb.
 * Update the state variables once they change.
 */
watch(
	() => props.item.selected,
	bool => {
		selected.value = toValue(bool)
	}
)

/**
 * On load, the override prices are still being fetched from idb.
 * When they are being loaded, update the state variable if available within the map.
 */
watch(
	() => props.overridePrices,
	overrides => {
		for (const faction of getKeys(EXPEDITION_FACTION)) {
			const overrideInstance = overrides.get(`${EXPEDITION_TYPE[`LOGBOOK_${faction}`]}_${props.item.tier}`)
			if (overrideInstance) {
				logbooks.value[faction] = overrideInstance
			}
		}
	},
	{ once: true }
)

// GETTERS

/**
 * Computed the stack size for each faction depending on prices.
 */
const computedLogbookStackSize = computed<Record<ExpeditionFaction, number>>(() => {
	const stackSizes = {
		BLACK_SCYTHE_MERCENARIES: 0,
		DRUIDS_OF_THE_BROKEN_CIRCLE: 0,
		ORDER_OF_THE_CHALICE: 0,
		KNIGHTS_OF_THE_SUN: 0,
	}

	if (props.item.selected === false) return stackSizes

	// Loop through the peritemattributes of this logbook stack and assign to highest faction price.
	props.item.perItemAttributes?.forEach(attributes => {
		if (!attributes.logbookMods) return

		// Get the index of the highest priced logbook faction in this particular item
		const indexOfHighestPricedLogbook = attributes.logbookMods.reduce((maxIdx, currentFactionIdx, currentIdx, arr) => {
			const maxIdxFaction = EXPEDITION_FACTION_IDX_TO_NAME[arr[maxIdx]]
			const highestPriceLogbook = logbooks.value[maxIdxFaction]
			const currentFaction = EXPEDITION_FACTION_IDX_TO_NAME[currentFactionIdx]
			const currentLogbook = logbooks.value[currentFaction]

			return currentLogbook.priceOverride > highestPriceLogbook.priceOverride ? currentIdx : maxIdx
		}, 0)

		// Get the faction name
		const factionName = EXPEDITION_FACTION_IDX_TO_NAME[attributes.logbookMods[indexOfHighestPricedLogbook]]

		// Add it to the stack size array
		if (factionName) {
			stackSizes[factionName] += 1
		}
	})

	return stackSizes
})

/**
 * Compute the price of the entire stack.
 */
const stackPrice = computed(() => {
	let price = 0
	for (const faction of getKeys(EXPEDITION_FACTION)) {
		const logbookPrice = logbooks.value[faction].priceOverride
		const quantity = computedLogbookStackSize.value[faction]
		price += logbookPrice * quantity
	}
	return Math.round(toValue(price) * 10) / 10
})

// METHODS
function generateFactionLogbookOverrideInstance(faction: ExpeditionFaction): BulkyItemOverrideInstance {
	return {
		type: EXPEDITION_TYPE[`LOGBOOK_${faction}`],
		tier: props.item.tier,
		priceOverride: 0,
		league: props.item.league,
		category: 'EXPEDITION',
		selected: true,
	}
}

// STYLES

/**
 * Defines styles in case this item is unselected.
 */
const style = computed(() => {
	if (!selected.value) {
		return {
			'text-decoration': 'line-through',
			opacity: 0.5,
		}
	}
	return {}
})
</script>

<style scoped>
.m-stash-item,
.metadata {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 8;
	align-items: center;
}

.metadata {
	height: 2rem;
}

.grid-column-3-8 {
	grid-column: 3/8;
}

.logbook-faction-prices {
	overflow: hidden;
	display: grid;
	grid-template-columns: 3.5rem max-content 6rem max-content 6ch 1.5rem 1.5rem;
	grid-auto-rows: 2rem;
	gap: 0.5rem;
}

.name {
	text-wrap: nowrap;
	overflow: auto;
}

.stack-size {
	text-align: center;
}

.stack-price {
	text-align: center;
}

/*
Due to the transition, leaving items get a position: absolute prop.
This takes the element out of the layout flow and therefore nullifies the subgrid.
This is an estimate of the average column layout.
*/
.list-leave-active {
	grid-template-columns: 1rem 1.5rem 1fr 3ch 3ch 3ch 4.15ch;
	gap: 0.5rem;
	width: calc(100% - 1rem);
}
</style>
