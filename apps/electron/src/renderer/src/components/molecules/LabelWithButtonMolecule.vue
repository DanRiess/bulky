<template>
	<div class="m-label-with-button" :class="{ disabled }">
		<LabelAtom ref="labelEl" :id="uuid">
			<slot />
		</LabelAtom>
		<ButtonAtom @click="emit('click')" :background-color="backgroundColor">{{ buttonText }}</ButtonAtom>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'

const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = withDefaults(
	defineProps<{
		buttonText: string
		backgroundColor?: ButtonBackgroundColorScheme
		labelPosition?: 'left' | 'right'
		disabled?: boolean
	}>(),
	{
		labelPosition: 'left',
		disabled: false,
		backgroundColor: 'dark',
	}
)

// EMITS
const emit = defineEmits<{
	click: []
}>()

// STATE
const labelEl = ref<InstanceType<typeof LabelAtom>>()

// LIFECYCLE
onMounted(() => {
	if (!labelEl.value) return

	labelEl.value.$el.style.gridArea = props.labelPosition
})
</script>

<style scoped>
.m-label-with-button {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}
</style>
