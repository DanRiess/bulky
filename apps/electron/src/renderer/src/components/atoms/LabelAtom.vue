<template>
	<label :for="id" class="a-label no-select">
		<slot />
	</label>
</template>

<script setup lang="ts">
import { Uuid } from '@web/types/utitlity.types'

defineProps<{
	id: Uuid | string
}>()
</script>

<style scoped>
.a-label {
	cursor: pointer;
}
</style>
@web/types/utility.types
