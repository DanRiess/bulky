<template>
	<SvgButtonWithPopupMolecule icon-name="refresh" background-color="dark" @click="onClick">
		<slot />
	</SvgButtonWithPopupMolecule>
</template>

<script setup lang="ts">
import { ApiStatus } from '@web/api/api.types'
import SvgButtonWithPopupMolecule from './SvgButtonWithPopupMolecule.vue'

// PROPS
defineProps<{
	status: ApiStatus
}>()

//EMITS
const emit = defineEmits<{
	click: []
}>()

// METHODS
function onClick() {
	emit('click')
}
</script>
