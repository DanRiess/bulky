<template>
	<label :for="id" class="a-label no-select">
		<slot />
	</label>
</template>

<script setup lang="ts">
import { Uuid } from '@shared/types/utility.types'

defineProps<{
	id: Uuid | string
}>()
</script>

<style scoped>
.a-label {
	cursor: pointer;
	word-break: break-word;
}
</style>
