<template>
	<div class="a-checkbox">
		<input type="checkbox" class="a-checkbox-input" :id="id" v-model="model" :disabled="disabled" />
		<div class="checkmark" v-if="model">
			<SvgIconAtom name="done" :use-gradient="true" :active="true" width="175%" height="175%" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Uuid } from '@shared/types/utility.types'
import SvgIconAtom from './SvgIconAtom.vue'

const model = defineModel<boolean>({ required: true })

defineProps<{
	id?: Uuid
	disabled?: boolean
}>()
</script>

<style scoped>
.a-checkbox {
	height: 1rem;
	width: 1rem;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	translate: 0 -1px;
}

.a-checkbox-input {
	position: relative;
	height: 14px;
	width: 14px;
	cursor: pointer;
}

.a-checkbox-input:before {
	content: '';
	display: block;
	position: absolute;
	width: 16px;
	height: 16px;
	top: -1px;
	left: -1px;
	border: 1px solid var(--color-dark-100);
	border-radius: 3px;
	background-color: var(--dr-background-color-app);
}

.checkmark {
	position: absolute;
	height: 100%;
	width: 100%;
	/* top: -9px;
	left: -4px; */
	pointer-events: none;
	transform: translate(-20%, -40%);
}
</style>
