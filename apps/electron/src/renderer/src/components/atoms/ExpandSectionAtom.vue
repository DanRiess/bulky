<template>
	<div class="expand-section" @click="emit('toggleExpanded')">
		<SvgIconAtom
			name="expandMore"
			cursor="pointer"
			:use-gradient="true"
			:transform="expanded ? 'translateY(-2px) rotate(0)' : 'translateY(-2px) rotate(-90deg)'" />
	</div>
</template>

<script setup lang="ts">
import SvgIconAtom from './SvgIconAtom.vue'

defineProps<{
	expanded: boolean
}>()

const emit = defineEmits<{
	toggleExpanded: []
}>()
</script>

<style scoped>
.expand-section {
	display: inline-block;
	height: 1.5rem;
}
</style>
