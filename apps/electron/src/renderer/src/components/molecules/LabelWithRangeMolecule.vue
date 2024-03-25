<template>
	<div class="m-label-with-range">
		<LabelAtom :id="uuid">
			<slot />
		</LabelAtom>
		<div class="input-container">
			<InputRangeAtom v-model="model" :min="min" :max="max" :step="step" :id="id" :disabled="disabled" />
			<InputTextAtom v-model="textModel" :editable="false" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputRangeAtom from '../atoms/InputRangeAtom.vue'
import InputTextAtom from '../atoms/InputTextAtom.vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { Uuid } from '@web/types/utitlity.types'

const model = defineModel<number>({ required: true })
const textModel = computed(() => {
	return `${Math.round(model.value * 100)}%`
})
const uuid = BULKY_UUID.generateTypedUuid()

withDefaults(
	defineProps<{
		id?: Uuid
		labelPosition?: 'left' | 'right'
		min?: number
		max?: number
		step?: number
		disabled?: boolean
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
	}
)
</script>

<style scoped>
.m-label-with-range {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}

.input-container {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 6ch;
	gap: 0.5rem;
}
</style>
@web/types/utility.types
