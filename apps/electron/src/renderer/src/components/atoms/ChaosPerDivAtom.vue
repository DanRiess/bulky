<template>
	<div class="chaos-per-div no-select" @mouseenter="emit('mouseenter')" @mouseleave="emit('mouseleave')">
		1
		<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
		=
		{{ Math.round(chaosPerDiv) }}
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</div>
</template>

<script setup lang="ts">
// PROPS
defineProps<{
	chaosPerDiv: number
}>()

// EMITS
const emit = defineEmits<{
	mouseenter: []
	mouseleave: []
}>()
</script>

<style scoped>
.chaos-per-div {
	display: flex;
	text-wrap: nowrap;
}
</style>
