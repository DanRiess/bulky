<template>
	<AccordionTransitionWrapperAtom :expanded="!filter.fullBuyout">
		<h2>Specific Filter Fields</h2>
		<div class="filters flow">
			<FilterFieldHeaderMolecule
				main-option-name="Name"
				secondary-option-name="Tier"
				:always-max-quantity="filter.alwaysMaxQuantity"
				key="header" />
			<TransitionAtom :group="true" v-on="hooks">
				<FilterFieldMolecule
					v-for="(field, idx) in filter.fields"
					:key="field.uuid"
					v-model:mainModel="field.mainOption"
					v-model:secondaryModel="field.secondaryOption"
					v-model:quantityModel="field.quantity"
					:main-options="mainOptions"
					:secondary-options="secondaryOptions"
					:always-max-quantity="filter.alwaysMaxQuantity"
					:idx="idx"
					:disable-remove="filter.fields.length < 2"
					@remove-filter="emit('removeFilterField', filter.uuid, idx)" />
			</TransitionAtom>
		</div>
		<TransitionAtom v-on="buttonHooks">
			<div class="actions" v-if="filter.fields.length < 4">
				<ButtonAtom background-color="dark" @click="emit('addFilterField', filter.uuid)">Add Filter</ButtonAtom>
			</div>
		</TransitionAtom>
	</AccordionTransitionWrapperAtom>
</template>

<script setup lang="ts">
import { useListTransition } from '@web/transitions/listTransition'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import FilterFieldHeaderMolecule from './FilterFieldHeaderMolecule.vue'
import FilterFieldMolecule from './FilterFieldMolecule.vue'
import { AnyFilter, FilterMainOption, FilterSecondaryOption } from '@web/types/bulky.types'
import { Uuid } from '@web/types/utitlity.types'
import ButtonAtom from '../atoms/ButtonAtom.vue'

// PROPS
defineProps<{
	filter: AnyFilter
	mainOptions: FilterMainOption[]
	secondaryOptions: FilterSecondaryOption[]
}>()

// EMITS
const emit = defineEmits<{
	addFilterField: [uuid: Uuid<AnyFilter>]
	removeFilterField: [uuid: Uuid<AnyFilter>, idx: number]
}>()

// HOOKS
const hooks = useListTransition({
	marginTop: '0.5rem',
	duration: 0.35,
})

const buttonHooks = useListTransition({
	duration: 0.35,
})
</script>

<style scoped>
/* don't use subgrid here, it will muck up the filter field animation */
.filters {
	position: relative;
	/* display: grid;
	grid-template-columns: 2fr 1fr auto auto 1.5rem;
	gap: 0.5rem; */
}

.filters > * {
	--flow-space: 0.5em;
}
</style>
