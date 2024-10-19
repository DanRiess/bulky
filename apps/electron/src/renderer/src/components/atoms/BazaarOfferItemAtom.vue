<template>
	<li class="a-bazaar-offer-item">
		<div class="generic-item-data">
			<div class="name">{{ item.name }}</div>
			<div class="stock" v-if="!filter.fullBuyout">x{{ item.computedQuantity }}</div>
			<div class="quantity">
				{{ filter.alwaysMaxQuantity || filter.fullBuyout ? item.computedQuantity : filterField?.quantity }}
			</div>
			<div>*</div>
			<div class="price">{{ computedPrice }}</div>
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
		<div
			class="special-item-data"
			ref="tooltipParentElement"
			v-if="item.category === 'MAP_8_MOD'"
			@mouseenter="showTooltip = true"
			@mouseleave="showTooltip = false">
			<SvgIconAtom name="listRemove" :color="item.regex.avoidRegex ? 'var(--color-success)' : 'var(--color-error)'" />
			<SvgIconAtom name="listAdd" :color="item.regex.wantedRegex ? 'var(--color-success)' : 'var(--color-error)'" />
			<SvgIconAtom name="quantity" :color="item.regex.quantityRegex ? 'var(--color-success)' : 'var(--color-error)'" />
			<SvgIconAtom name="packsize" :color="item.regex.packsizeRegex ? 'var(--color-success)' : 'var(--color-error)'" />
		</div>
		<TooltipAtom :show="showTooltip" :parent="tooltipParentElement" :max-width="300">
			<RegexTooltipTemplate :prices="item.regex" />
		</TooltipAtom>
	</li>
</template>

<script setup lang="ts">
import { BulkyBazaarItem, BulkyFilter, ComputedBulkyOfferStore } from '@shared/types/bulky.types'
import { computed, ref } from 'vue'
import SvgIconAtom from './SvgIconAtom.vue'
import RegexTooltipTemplate from '../implementations/RegexTooltipTemplate.vue'
import TooltipAtom from './TooltipAtom.vue'

// PROPS
const props = withDefaults(
	defineProps<{
		item: BulkyBazaarItem
		filter: BulkyFilter
		priceComputeFunction: ComputedBulkyOfferStore['calculateItemBasePrice']
	}>(),
	{}
)

// STATE
const filterField = props.filter.fields.find(field => field.type === props.item.type && field.tier === props.item.tier)
const showTooltip = ref(false)
const tooltipParentElement = ref<HTMLElement>()

// GETTERS
const gridColumn = computed(() => (props.filter.fullBuyout ? 'span 5' : 'span 6'))

const computedPrice = computed(() => {
	return props.priceComputeFunction(props.item, props.filter)
})
</script>

<style scoped>
.a-bazaar-offer-item {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: v-bind(gridColumn);
	align-items: center;
	user-select: none;
	transition: all 0.25s ease;
}

.generic-item-data {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: v-bind(gridColumn);
}

.name,
.secondary-option {
	text-wrap: nowrap;
	overflow: hidden;
}

.name {
	font-weight: 400;
	margin-right: 0.5rem;
}

.stock {
	text-align: left;
	padding-left: 0.25rem;
	padding-right: 0.4rem;
}

.quantity {
	text-align: end;
}

.price {
	text-align: start;
}

.special-item-data {
	display: flex;
	gap: 0.25rem;
	grid-column: v-bind(gridColumn);
	flex-wrap: wrap;
	margin-top: 0.25rem;
	margin-left: 2rem;
	position: relative;
	max-width: max-content;
}

.special-item-data::before {
	content: '';
	position: absolute;
	top: -0.25rem;
	left: -15px;
	width: 10px;
	height: 60%;
	border-left: 1px solid;
	border-bottom: 1px solid;
}
</style>
