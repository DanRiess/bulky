<template>
	<div class="m-filter-field" :data-index="idx">
		<div class="item">
			<InputSelectAtom v-model="mainModel" :id="itemId" :options="mainOptions"></InputSelectAtom>
		</div>
		<div class="modifier" v-if="secondaryOptions">
			<InputSelectAtom v-model="secondaryModel" :id="modifierId" :options="secondaryOptions"></InputSelectAtom>
		</div>
		<div class="amount">
			<InputNumberAtom v-model="amountModel" :id="amountId" :min="1" />
		</div>
		<!-- <div class="max-price">
			<InputNumberAtom v-model="maxBuyoutModel" :id="maxPriceId" :min="0" />
		</div> -->
		<div class="remove" @click="emit('removeFilter')" v-if="!disableRemove">
			<SvgIconAtom name="close" cursor="pointer" :use-gradient="true" />
		</div>
	</div>
</template>

<script setup lang="ts" generic="MainOptionType extends string, SecondaryOptionType extends string">
import { BULKY_UUID } from '@web/utility/uuid'
import InputSelectAtom from '../atoms/InputSelectAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// MODELS
const mainModel = defineModel<string>('mainModel')
const secondaryModel = defineModel<string>('secondaryModel')
const amountModel = defineModel<number>('amountModel', { required: true })
// const maxBuyoutModel = defineModel<number>('maxBuyoutModel', { required: true })

//PROPS
const props = withDefaults(
	defineProps<{
		mainOptions: MainOptionType[]
		secondaryOptions?: SecondaryOptionType[]
		disableRemove?: boolean
		idx: number
	}>(),
	{
		disableRemove: false,
	}
)

// EMITS
const emit = defineEmits<{
	removeFilter: []
}>()

// STATE
const itemId = BULKY_UUID.generateTypedUuid()
const modifierId = BULKY_UUID.generateTypedUuid()
const amountId = BULKY_UUID.generateTypedUuid()
// const maxPriceId = BULKY_UUID.generateTypedUuid()
const zIndex = 300 - props.idx
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.m-filter-field {
	/* display: grid;
	grid: subgrid / subgrid;
	grid-column: span 5; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: 2fr 1fr min(7ch) 1.5rem;
	gap: 0.5rem;
	position: relative;
	z-index: v-bind(zIndex);
}

.remove {
	display: flex;
	align-items: center;
}

.max-price,
.amount {
	place-self: center;
}
</style>
