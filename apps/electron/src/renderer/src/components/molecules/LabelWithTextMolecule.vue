<template>
	<div class="m-label-with-text" :class="{ disabled }">
		<LabelAtom ref="labelEl" :id="uuid">
			<slot />
		</LabelAtom>
		<!-- <InputCheckboxAtom v-model="model" :id="uuid" :disabled="disabled" /> -->
		<InputTextAtom v-model="model" :placeholder="placeholder" :max-length="maxLength" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import InputTextAtom from '../atoms/InputTextAtom.vue'

const model = defineModel<string>({ required: true })
const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = withDefaults(
	defineProps<{
		labelPosition?: 'left' | 'right'
		disabled?: boolean
		placeholder?: string
		maxLength?: string
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
		placeholder: '',
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
