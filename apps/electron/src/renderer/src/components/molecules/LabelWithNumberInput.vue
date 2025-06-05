<template>
	<div class="m-label-with-text" :class="{ disabled }">
		<LabelAtom ref="labelEl" :id="uuid">
			<slot />
		</LabelAtom>
		<!-- <InputCheckboxAtom v-model="model" :id="uuid" :disabled="disabled" /> -->
		<InputNumberAtom v-model="model" v-bind="inputProps" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'

const model = defineModel<number>({ required: true })
const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = withDefaults(
	defineProps<{
		labelPosition?: 'left' | 'right'
		disabled?: boolean
		inputProps?: Omit<InstanceType<typeof InputNumberAtom>['$props'], 'modelValue'>
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
	}
)

// STATE
const labelEl = ref<InstanceType<typeof LabelAtom>>()

// LIFECYCLE
onMounted(() => {
	if (!labelEl.value) return

	labelEl.value.$el.style.gridArea = props.labelPosition
})
</script>

<style scoped>
.m-label-with-text {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}
</style>
