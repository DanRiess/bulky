<template>
	<div class="o-settings flow">
		<Component :is="component" v-if="component" />
		<div class="affiliation-notice">This product isn't affiliated with or endorsed by Grinding Gear Games in any way.</div>
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
.o-settings {
	padding: 0.5rem;
}

.affiliation-notice {
	position: absolute;
	bottom: 0.5rem;
	left: 1rem;
}
</style>
