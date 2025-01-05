<template>
	<div class="o-settings flow">
		<Component :is="component" v-if="component" />
	</div>
</template>

<script setup lang="ts">
import { SettingsCategory } from '@shared/types/settings.types'
import { computed } from 'vue'
import SettingsGeneralImplementation from '../implementations/SettingsGeneralImplementation.vue'
import SettingsHotkeysImplementation from '../implementations/SettingsHotkeysImplementation.vue'

// PROPS
const props = defineProps<{
	activeCategory: SettingsCategory
}>()

// GETTERS
const component = computed(() => {
	if (props.activeCategory === 'GENERAL') return SettingsGeneralImplementation
	else if (props.activeCategory === 'HOTKEYS') return SettingsHotkeysImplementation
	else return undefined
})
</script>

<style scoped>
.o-config {
	padding: 0.5rem;
}
</style>
