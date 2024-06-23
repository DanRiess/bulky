<template>
	<div class="m-filter-field">
		<div class="item">
			<InputSelectAtom v-model="filterField.type" :id="itemId" :options="store.filterFieldTypeOptions"></InputSelectAtom>
		</div>
		<div class="modifier" v-if="store.filterFieldTierOptions.length > 0">
			<InputSelectAtom
				v-model="filterField.tier"
				:id="modifierId"
				:options="store.filterFieldTierOptions"></InputSelectAtom>
		</div>
		<div class="quantity" :class="{ hidden: store.filter.alwaysMaxQuantity }">
			<InputNumberAtom v-model="filterField.quantity" :id="quantityId" :min="1" />
		</div>
		<div class="remove" @click="emit('removeFilterField')" v-if="!disableRemove">
			<SvgIconAtom name="close" cursor="pointer" :use-gradient="true" />
		</div>
	</div>
</template>

<script setup lang="ts" generic="MainOptionType extends string, SecondaryOptionType extends string">
import { BULKY_UUID } from '@web/utility/uuid'
import InputSelectAtom from '../atoms/InputSelectAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { computed } from 'vue'
import { BulkyFilterField, ComputedBulkyFilterStore } from '@shared/types/bulky.types'

// MODELS
// const mainModel = defineModel<string>('mainModel')
// const secondaryModel = defineModel<string>('secondaryModel')
// const quantityModel = defineModel<number>('quantityModel', { required: true })
// // const maxBuyoutModel = defineModel<number>('maxBuyoutModel', { required: true })
const filterField = defineModel<BulkyFilterField>({ required: true })

//PROPS
const props = defineProps<{
	store: ComputedBulkyFilterStore
	zIndex: number
}>()

// EMITS
const emit = defineEmits<{
	removeFilterField: []
}>()

// STATE
const itemId = BULKY_UUID.generateTypedUuid()
const modifierId = BULKY_UUID.generateTypedUuid()
const quantityId = BULKY_UUID.generateTypedUuid()

// GETTERS
const disableRemove = computed(() => {
	return props.store.filter.fields.length <= 1
})

const gridTemplateColumns = computed(() => {
	const tierOptionsAvailable = props.store.filterFieldTierOptions.length > 0 ? '1fr' : '0'
	const quant = props.store.filter.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${tierOptionsAvailable} ${quant} 1.5rem`
})
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.m-filter-field {
	/* display: grid;
	grid: subgrid / subgrid;
	grid-column: span 5; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.5rem;
	position: relative;
	z-index: v-bind(zIndex);
	transition: grid-template-columns 0.25s ease;
}

.remove {
	display: flex;
	align-items: center;
}

.max-price,
.quantity {
	place-self: center;
	transition: opacity 0.25s ease;
}
</style>
