<template>
	<li class="a-bazaar-offer-item">
		<div class="generic-item-data">
			<div class="name">{{ item.name }}</div>
			<div class="stock" v-if="!filter.fullBuyout">x{{ item.quantity }}</div>
			<div class="quantity">
				{{ filter.alwaysMaxQuantity || filter.fullBuyout ? item.quantity : filterField?.quantity }}
			</div>
			<div>*</div>
			<div class="price">{{ item.price }}</div>
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
		<div class="special-item-data" v-if="item.category === 'MAP_8_MOD'">
			<div class="regex-option avoid-regex" v-if="item.regex.avoidRegex">
				<SvgIconAtom name="listRemove" color="var(--color-success)" />
				<div class="regex-price">: {{ item.regex.avoidRegex }}c</div>
			</div>
			<div class="regex-option wanted-regex" v-if="item.regex.wantedRegex">
				<SvgIconAtom name="listAdd" color="var(--color-success)" />
				<div class="regex-price">: {{ item.regex.wantedRegex }}c</div>
			</div>
			<div class="regex-option quantity-regex" v-for="quantOffer in item.regex.quantityRegex">
				<SvgIconAtom name="quantity" color="var(--color-success)" />
				<div class="regex-price">{{ quantOffer[0] }}%: {{ quantOffer[1] }}c</div>
			</div>
			<div class="regex-option quantity-regex" v-for="packsizeOffer in item.regex.packsizeRegex">
				<SvgIconAtom name="packsize" color="var(--color-success)" />
				<div class="regex-price">{{ packsizeOffer[0] }}%: {{ packsizeOffer[1] }}c</div>
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import { BulkyBazaarItem, BulkyFilter } from '@shared/types/bulky.types'
import { computed } from 'vue'
import SvgIconAtom from './SvgIconAtom.vue'

// PROPS
const props = withDefaults(
	defineProps<{
		item: BulkyBazaarItem
		filter: BulkyFilter
	}>(),
	{}
)

// STATE
const filterField = props.filter.fields.find(field => field.type === props.item.type && field.tier === props.item.tier)

// GETTERS
const gridColumn = computed(() => (props.filter.fullBuyout ? 'span 5' : 'span 6'))
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
	gap: 0.5rem;
	grid-column: v-bind(gridColumn);
	flex-wrap: wrap;
	margin-top: 0.25rem;
	margin-left: 2rem;
	position: relative;
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

.regex-option {
	display: flex;
}

.regex-price {
	white-space: nowrap;
}
</style>
