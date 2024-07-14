<template>
	<div class="m-label-with-checkbox">
		<div class="label" ref="labelEl">
			<LabelAtom :id="uuid" :class="{ disabled }">
				<slot />
			</LabelAtom>
			<InfoPanelMolecule v-if="hasInfoPanel" v-bind="infoPanelProps">
				<slot name="infoSlot" />
			</InfoPanelMolecule>
		</div>
		<InputCheckboxAtom v-model="model" :id="uuid" :disabled="disabled" :class="{ disabled }" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import InfoPanelMolecule from './InfoPanelMolecule.vue'

const model = defineModel<boolean>({ required: true })
const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = withDefaults(
	defineProps<{
		labelPosition?: 'left' | 'right'
		disabled?: boolean
		hasInfoPanel?: boolean
		infoPanelProps?: InstanceType<typeof InfoPanelMolecule>['$props']
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
		hasInfoPanel: false,
		infoPanelProps: () => ({
			iconWidth: 16,
		}),
	}
)

// STATE
const labelEl = ref<HTMLElement>()

// LIFECYCLE
onMounted(() => {
	if (!labelEl.value) return

	labelEl.value.style.gridArea = props.labelPosition
})
</script>

<style scoped>
.m-label-with-checkbox {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}

.label {
	display: flex;
	gap: 0.2rem;
}
</style>
