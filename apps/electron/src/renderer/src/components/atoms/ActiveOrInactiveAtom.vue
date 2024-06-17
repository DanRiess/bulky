<template>
	<div class="a-active-or-inactive" :style="style">
		{{ text }}
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// PROPS
const props = defineProps<{
	active: boolean
}>()

// GETTERS
const text = computed(() => {
	return props.active ? 'Active' : 'Inactive'
})

const style = computed(() => {
	if (props.active) {
		return {
			color: 'var(--color-success)',
		}
	} else {
		return {
			color: 'var(--color-error)',
		}
	}
})
</script>

<style scoped>
.a-active-or-inactive {
	user-select: none;
}
</style>
