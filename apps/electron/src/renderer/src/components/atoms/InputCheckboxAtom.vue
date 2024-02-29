<template>
	<div class="a-checkbox">
		<input type="checkbox" class="a-checkbox-input" :id="id" v-model="model" />
		<div class="checkmark" v-if="model">
			<SvgIconAtom name="done" :use-gradient="true" :active="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Uuid } from '@web/types/utitlity.types'
import SvgIconAtom from './SvgIconAtom.vue'

const model = defineModel<boolean>({ required: true })

defineProps<{
	id?: Uuid
}>()
</script>

<style scoped>
.a-checkbox {
	height: 1rem;
	width: 1rem;
	position: relative;
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
	height: 1.7rem;
	width: 1.7rem;
	top: -5px;
	pointer-events: none;
}
</style>
