<template>
	<label :for="id" class="no-select">
		<slot />
	</label>
</template>

<script setup lang="ts">
import { Uuid } from '@web/types/utitlity.types'

defineProps<{
	id: Uuid | string
}>()
</script>
