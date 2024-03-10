<template>
	<div class="m-label-with-checkbox" :class="{ disabled }">
		<LabelAtom :id="uuid">
			<slot />
		</LabelAtom>
		<InputCheckboxAtom v-model="model" :id="uuid" :disabled="disabled" />
	</div>
</template>

<script setup lang="ts">
import InputCheckboxAtom from '../atoms/InputCheckboxAtom.vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'

const model = defineModel<boolean>({ required: true })
const uuid = BULKY_UUID.generateTypedUuid()

withDefaults(
	defineProps<{
		labelPosition?: 'left' | 'right'
		disabled?: boolean
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
	}
)
</script>

<style scoped>
.m-label-with-checkbox {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}
</style>
