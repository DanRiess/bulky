<template>
	<div class="m-filter-field">
		<div class="field-type">
			<InputSelectAtom v-model="filterField.type" :id="itemId" :options="store.filterFieldTypeOptions"></InputSelectAtom>
		</div>

		<!-- A filter has at least one secondary option, because it's required for consistent typing -->
		<div class="field-tier" v-if="store.filterFieldTierOptions.length > 1">
			<InputSelectAtom
				v-model="filterField.tier"
				:id="modifierId"
				:options="store.filterFieldTierOptions"></InputSelectAtom>
		</div>
		<div class="field-quantity" :class="{ hidden: store.filter.alwaysMaxQuantity }">
			<InputNumberAtom v-model="filterField.quantity" :id="quantityId" :min="1" />
		</div>
		<div class="field-remove" @click="emit('removeFilterField')" v-if="!disableRemove">
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
	const tierOptionsAvailable = props.store.filterFieldTierOptions.length > 1 ? '1fr' : '0'
	const quant = props.store.filter.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${tierOptionsAvailable} ${quant} 1.5rem`
})
</script>

<style scoped>
/* don't use subgrid here, it will somehow mess up the filter field animation */
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

.field-type {
	grid-column: 1/2;
}

.field-tier {
	grid-column: 2/3;
}

.field-quantity {
	place-self: center;
	grid-column: 3/4;
	transition: opacity 0.25s ease;
}

.field-remove {
	display: flex;
	align-items: center;
}
</style>
