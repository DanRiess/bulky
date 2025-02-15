<template>
	<div class="m-input-with-label">
		<LabelAtom :id="uuid">
			<slot />
		</LabelAtom>
		<InputSelectAtom
			v-model="model"
			:options="options"
			:id="uuid"
			:background-color="backgroundColor"
			:allow-freestyle-input="allowFreestyleInput" />
	</div>
</template>

<script setup lang="ts" generic="T extends string">
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'
import InputSelectAtom from '../atoms/InputSelectAtom.vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'

const model = defineModel<T>({ required: true })
const uuid = BULKY_UUID.generateTypedUuid()

withDefaults(
	defineProps<{
		options: T[]
		labelPosition?: 'left' | 'right'
		backgroundColor?: ButtonBackgroundColorScheme
		allowFreestyleInput?: boolean
	}>(),
	{
		labelPosition: 'left',
		backgroundColor: 'dark',
		allowFreestyleInput: false,
	}
)
</script>

<style scoped>
.m-input-with-label {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}
</style>
