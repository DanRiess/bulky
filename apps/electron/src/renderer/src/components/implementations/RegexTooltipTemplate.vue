<template>
	<div class="t-regex-tooltip" v-if="conformedPrices">
		<div class="regex-option avoid">
			<SvgIconAtom name="listRemove" :color="conformedPrices.avoid ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Avoid Mods: </span>
			<div class="price">
				<span>{{ conformedPrices.avoid ?? 'n/a' }}</span>
				<img
					v-if="conformedPrices.avoid"
					src="/src/assets/png-icons/currency-chaos.png"
					height="24"
					width="24"
					decoding="async"
					loading="lazy" />
			</div>
		</div>
		<div class="regex-option wanted">
			<SvgIconAtom name="listAdd" :color="conformedPrices.wanted ? 'var(--color-success)' : 'var(--color-error)'" />
			<span>Wanted Mods: </span>
			<div class="price">
				<span>{{ conformedPrices.wanted ?? 'n/a' }}</span>
				<img
					v-if="conformedPrices.wanted"
					src="/src/assets/png-icons/currency-chaos.png"
					height="24"
					width="24"
					decoding="async"
					loading="lazy" />
			</div>
		</div>
		<template v-if="conformedPrices.quantity">
			<div class="regex-option quantity" v-for="option in conformedPrices.quantity">
				<SvgIconAtom name="quantity" :color="option ? 'var(--color-success)' : 'var(--color-error)'" />
				<span>{{ option[0] }}% Quantity: </span>
				<div class="price">
					<span>{{ option[1] }}</span>
					<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
				</div>
			</div>
		</template>
		<template v-else>
			<SvgIconAtom name="quantity" color="var(--color-error)" />
			<span>Quantity:</span>
			<span>n/a</span>
		</template>
		<template v-if="conformedPrices.packsize">
			<div class="regex-option packsize" v-for="option in conformedPrices.packsize">
				<SvgIconAtom name="packsize" color="var(--color-success)" />
				<span>{{ option[0] }}% Pack Size: </span>
				<div class="price">
					<span>{{ option[1] }}</span>
					<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
				</div>
			</div>
		</template>
		<template v-else>
			<SvgIconAtom name="packsize" color="var(--color-error)" />
			<span>Pack Size:</span>
			<span>n/a</span>
		</template>
	</div>
</template>

<script setup lang="ts">
import { Map8ModPrices } from '@web/categories/map/map.types'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { BulkyBazaarItem } from '@shared/types/bulky.types'
import { computed } from 'vue'

const props = defineProps<{
	prices: Map8ModPrices | BulkyBazaarItem['regex']
}>()

const conformedPrices = computed(() => {
	if (!props.prices) return undefined

	let avoid: number | undefined
	let wanted: number | undefined
	let quantity: [number, number][] | undefined
	let packsize: [number, number][] | undefined

	if (props.prices.avoidRegex === undefined || typeof props.prices.avoidRegex === 'number') {
		avoid = props.prices.avoidRegex
	} else if (props.prices.avoidRegex.available) {
		avoid = props.prices.avoidRegex.addedPrice
	}

	if (props.prices.wantedRegex === undefined || typeof props.prices.wantedRegex === 'number') {
		wanted = props.prices.wantedRegex
	} else if (props.prices.wantedRegex.available) {
		wanted = props.prices.wantedRegex.addedPrice
	}

	if (props.prices.quantityRegex) {
		for (const maybeFragment of props.prices.quantityRegex) {
			if ('available' in maybeFragment) {
				if (maybeFragment.available === false) continue
				quantity !== undefined ? quantity.push(maybeFragment.addedPrice) : (quantity = [maybeFragment.addedPrice])
			} else {
				quantity !== undefined ? quantity.push(maybeFragment) : (quantity = [maybeFragment])
			}
		}
	}

	if (props.prices.packsizeRegex) {
		for (const maybeFragment of props.prices.packsizeRegex) {
			if ('available' in maybeFragment) {
				if (maybeFragment.available === false) continue
				packsize !== undefined ? packsize.push(maybeFragment.addedPrice) : (packsize = [maybeFragment.addedPrice])
			} else {
				packsize !== undefined ? packsize.push(maybeFragment) : (packsize = [maybeFragment])
			}
		}
	}

	return {
		avoid,
		wanted,
		quantity,
		packsize,
	}
})
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

.price {
	display: flex;
	gap: 0.15rem;
}
</style>
