<template>
	<AccordionTransitionWrapperAtom :expanded="!store.filter.fullBuyout">
		<h2>Specific Filter Fields</h2>
		<div class="filters flow">
			<FilterFieldHeaderMolecule main-option-name="Name" secondary-option-name="Tier" :store="store" key="header" />
			<TransitionAtom :group="true" v-on="hooks">
				<FilterFieldMolecule
					v-for="(field, idx) in store.filter.fields"
					:key="field.uuid"
					v-model="store.filter.fields[idx]"
					:store="store"
					:z-index="300 - idx"
					@remove-filter-field="store.removeFilterField(store.filter.uuid, idx)" />
			</TransitionAtom>
		</div>
		<TransitionAtom v-on="buttonHooks">
			<div class="actions" v-if="store.filter.fields.length < 4">
				<ButtonAtom background-color="dark" @click="store.addFilterField(store.filter.uuid)">Add Filter Field</ButtonAtom>
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
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { ComputedBulkyFilterStore } from '@shared/types/bulky.types'

// PROPS
defineProps<{
	store: ComputedBulkyFilterStore
}>()

// // EMITS
// const emit = defineEmits<{
// 	addFilterField: [uuid: Uuid<BulkyFilter>]
// 	removeFilterField: [uuid: Uuid<BulkyFilter>, idx: number]
// }>()

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
