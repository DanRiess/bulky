<template>
	<li class="regex-option">
		<div class="selected">
			<InputCheckboxAtom v-model="selected" />
		</div>
		<div
			class="explanation"
			:class="{ disabled: !selected }"
			:style="{ gridColumn: !regexPrice || typeof regexPrice === 'number' ? 'span 2' : 'span 1' }">
			<slot />
		</div>
		<div
			class="key-input"
			v-if="regexType === 'quantityRegex' || regexType === 'packsizeRegex'"
			:class="{ disabled: !selected }">
			<InputNumberAtom v-model="keyInput" />
			%
		</div>
		<div :class="{ disabled: !selected }">add</div>
		<div class="additional-price" :class="{ disabled: !selected }">
			<InputNumberAtom v-model="additionalPrice" />
		</div>
		<div class="chaos" :class="{ disabled: !selected }">
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
		<div class="close-or-add" v-if="showCloseOrHideSection">
			<SvgIconAtom
				name="close"
				cursor="pointer"
				:use-gradient="Array.isArray(regexPrice) && regexPrice.length === 1"
				hover-color="red" />
		</div>
	</li>
</template>

<script setup lang="ts">
import InputCheckboxAtom from './InputCheckboxAtom.vue'
import { computed, onMounted, ref } from 'vue'
import InputNumberAtom from './InputNumberAtom.vue'
import SvgIconAtom from './SvgIconAtom.vue'

// PROPS
const props = defineProps<{
	regexType: 'avoidRegex' | 'wantedRegex' | 'quantityRegex' | 'packsizeRegex'
	regexPrice: number | Record<number, number>[] | undefined
}>()

// STATE
const selected = ref(false)
const keyInput = ref(0)
const additionalPrice = ref(0)

// GETTERS
const showCloseOrHideSection = computed(() => {
	return selected.value && Array.isArray(props.regexPrice)
})

// HOOKS
onMounted(() => {
	if (Array.isArray(props.regexPrice)) {
		selected.value = props.regexPrice.length !== 0
	} else {
		selected.value = props.regexPrice ? props.regexPrice >= 0 : false
	}
})
</script>

<style scoped>
.regex-option {
	position: relative;
	margin-left: 2.5rem;
	height: 2rem;
	display: grid;
	grid-template-columns: subgrid;
	grid-column: span 7;
	align-items: center;
}

.regex-option::before {
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

.explanation {
	display: grid;
}

.key-input {
	display: flex;
	align-items: center;
	gap: 0.2rem;
}

.additional-price {
	display: flex;
	justify-content: center;
}

.disabled {
	text-decoration: line-through;
}
</style>
