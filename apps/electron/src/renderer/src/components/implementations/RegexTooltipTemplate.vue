<template>
	<div class="t-regex-tooltip">
		<div class="regex-option avoid">
			<SvgIconAtom name="listRemove" :color="prices.avoidRegex.available ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Avoid Mods: </span>
			<span>{{ prices.avoidRegex.available ? 'allowed' : 'disallowed' }}</span>
		</div>
		<div class="regex-option wanted">
			<SvgIconAtom name="listAdd" :color="prices.wantedRegex.available ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Wanted Mods: </span>
			<span>{{ prices.wantedRegex.available ? 'allowed' : 'disallowed' }}</span>
		</div>
		<div class="regex-option quantity" v-for="option in prices.quantityRegex">
			<SvgIconAtom name="quantity" :color="option.available ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Quantity: </span>
			<span>{{ prices.quantityRegex[0].available ? 'allowed' : 'disallowed' }}</span>
		</div>
		<div class="regex-option packsize" v-for="option in prices.packsizeRegex">
			<SvgIconAtom name="packsize" :color="option.available ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Pack Size: </span>
			<span>{{ prices.packsizeRegex[0].available ? 'allowed' : 'disallowed' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Map8ModPrices } from '@web/categories/map/map.types'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

defineProps<{
	prices: Map8ModPrices
}>()
</script>

<style scoped>
.t-regex-tooltip {
	display: grid;
	grid-template-columns: 1.5rem max-content max-content;
	gap: 0.5rem;
}

.regex-option {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 3;
}
</style>
