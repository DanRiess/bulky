<template>
	<img :src="imgSource" decoding="async" loading="lazy" />
</template>

<script setup lang="ts">
import { Category } from '@shared/types/bulky.types'
import { computed } from 'vue'

const props = defineProps<{
	category: Category
}>()

// GETTERS
const imgSource = computed(() => {
	if (props.category === 'ESSENCE') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9IYXRyZWQ3Iiwic2NhbGUiOjF9XQ/a69c5c06cc/Hatred7.png'
	} else if (props.category === 'SCARAB') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQnJlYWNoIiwic2NhbGUiOjF9XQ/b129897f73/GreaterScarabBreach.png'
	}
	return ''
})
</script>
