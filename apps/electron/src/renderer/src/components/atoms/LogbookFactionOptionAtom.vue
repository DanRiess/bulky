<template>
	<li class="logbook-faction">
		<div class="faction">{{ BULKY_TRANSFORM.stringToDisplayValue(faction) }}</div>
		<div class="additional-price">
			<InputNumberAtom
				v-model="factionLogbookOverrideInstance.priceOverride"
				@update:model-value="emit('updateOverrideValue', { overrideInstance: factionLogbookOverrideInstance })" />
		</div>
		<div class="chaos">
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
		<div class="stack-size">(Amount: {{ stackSize }})</div>
	</li>
</template>

<script setup lang="ts">
import { ExpeditionFaction } from '@web/categories/expedition/expedition.types'
import InputNumberAtom from './InputNumberAtom.vue'
import { BulkyItemOverrideInstance } from '@shared/types/bulky.types'
import { BULKY_TRANSFORM } from '@web/utility/transformers'

// MODEL
const factionLogbookOverrideInstance = defineModel<BulkyItemOverrideInstance>({ required: true })

// PROPS
defineProps<{
	faction: ExpeditionFaction
	stackSize: number
}>()

// EMITS
const emit = defineEmits<{
	updateOverrideValue: [item: { overrideInstance: BulkyItemOverrideInstance }]
}>()
</script>

<style scoped>
.logbook-faction {
	position: relative;
	margin-left: 2.5rem;
	height: 2rem;
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 8;
	align-items: center;
}

.logbook-faction::before {
	content: '';
	position: absolute;
	padding-top: 2rem;
	margin-top: -2rem;
	left: -1.5rem;
	top: 0;
	bottom: 0;
	transform: translateY(-25%);
	width: 1rem;
	border-left: 1px solid white;
	border-bottom: 1px solid white;
}

.faction {
	display: grid;
	grid-column: span 4;
}

.stack-size {
	display: grid;
	grid-column: span 2;
}

.additional-price {
	display: flex;
	justify-content: center;
}
</style>
