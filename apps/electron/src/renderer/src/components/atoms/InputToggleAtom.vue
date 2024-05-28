<template>
	<div class="a-input-toggle gradient-border" :class="{ highlight: model }" data-b-override @click="model = !model">
		<input type="checkbox" class="toggle-input" />
		<span class="toggle-ball" role="checkbox"></span>
	</div>
</template>

<script setup lang="ts">
import { Uuid } from '@shared/types/utility.types'
import { BULKY_UUID } from '@web/utility/uuid'
import { computed } from 'vue'

// MODEL
const model = defineModel<boolean>({ required: true })

// PROPS
const props = withDefaults(
	defineProps<{
		id?: Uuid
		disabled?: boolean
		width?: string
		height?: string
	}>(),
	{
		id: BULKY_UUID.generateTypedUuid(),
		disabled: false,
		width: '2rem',
		height: '1.1rem',
	}
)

// GETTERS
const ballSize = computed(() => {
	return `calc(${props.height} - 0.3rem)`
})

const ballPositionRight = computed(() => {
	return model.value ? '3px' : `calc(${props.width} - ${ballSize.value} - 3px)`
})
</script>

<style scoped>
.a-input-toggle {
	--border-radius: 1000vmax;
	--border-width: 2px;

	display: flex;
	align-items: center;
	width: v-bind(width);
	height: v-bind(height);
	background-color: var(--color-dark-500);
	cursor: pointer;
}

.a-input-toggle::after {
	content: '';
	height: v-bind(height);
	width: 100%;
	border: 1px solid var(--color-dark-100);
	border-radius: 1000vmax;
	transition: border-width 0.1s ease;
}

.a-input-toggle:hover {
	--show-border: 1;
}

.a-input-toggle:hover::after {
	border-width: 0;
}

.a-input-toggle.highlight {
	background-image: linear-gradient(90deg, var(--color-blue-bright), var(--color-purple-bright));
}

.a-input-toggle.highlight::after {
	border-color: white;
}

.toggle-input {
	display: none;
}

.toggle-ball {
	--size: 0.8rem;

	background-color: var(--color-light-300);
	height: v-bind(ballSize);
	width: v-bind(ballSize);
	position: absolute;
	top: 50%;
	right: v-bind(ballPositionRight);
	translate: 0 -50%;
	border-radius: 50%;
	transition: right 0.4s ease, background-color 0.4s ease;
}

.a-input-toggle.highlight > .toggle-ball {
	background-color: var(--color-light-200);
}
</style>
