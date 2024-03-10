<template>
	<div class="m-filter-field" :data-index="idx">
		<div class="item">
			<InputSelectAtom v-model="mainModel" :id="itemId" :options="mainOptions"></InputSelectAtom>
		</div>
		<div class="modifier" v-if="secondaryOptions">
			<InputSelectAtom v-model="secondaryModel" :id="modifierId" :options="secondaryOptions"></InputSelectAtom>
		</div>
		<div class="quantity" :class="{ hidden: alwaysMaxQuantity }">
			<InputNumberAtom v-model="quantityModel" :id="quantityId" :min="1" />
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
import { computed } from 'vue'

// MODELS
const mainModel = defineModel<string>('mainModel')
const secondaryModel = defineModel<string>('secondaryModel')
const quantityModel = defineModel<number>('quantityModel', { required: true })
// const maxBuyoutModel = defineModel<number>('maxBuyoutModel', { required: true })

//PROPS
const props = withDefaults(
	defineProps<{
		mainOptions: MainOptionType[]
		secondaryOptions?: SecondaryOptionType[]
		disableRemove?: boolean
		alwaysMaxQuantity: boolean
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
const quantityId = BULKY_UUID.generateTypedUuid()
// const maxPriceId = BULKY_UUID.generateTypedUuid()
const zIndex = 300 - props.idx

// GETTERS
const gridTemplateColumns = computed(() => {
	const secondary = props.secondaryOptions ? '1fr' : '0'
	const quant = props.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${secondary} ${quant} 1.5rem`
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
