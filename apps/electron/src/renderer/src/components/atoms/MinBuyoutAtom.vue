<template>
	<div class="a-min-buyout" :class="{ disabled }">
		<LabelAtom ref="labelEl" :id="uuid">
			<slot />
		</LabelAtom>
		<div class="price-input">
			<InputNumberAtom v-model="divineModel" :disabled="disabled" />
			<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
			<InputNumberAtom v-model="chaosModel" :disabled="disabled" />
			<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { BULKY_UUID } from '@web/utility/uuid'
import { onMounted, ref } from 'vue'
import LabelAtom from '../atoms/LabelAtom.vue'
import InputNumberAtom from './InputNumberAtom.vue'

const chaosModel = defineModel<number>('chaos', { required: true })
const divineModel = defineModel<number>('divine', { required: true })
const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = withDefaults(
	defineProps<{
		labelPosition?: 'left' | 'right'
		disabled?: boolean
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
.a-min-buyout {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
}

.price-input {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
</style>
