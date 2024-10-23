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
	} else if (props.category === 'DELIRIUM_ORB') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGVsaXJpdW0vRGVsaXJpdW1PcmJTY2FyYWJzIiwic2NhbGUiOjF9XQ/ca1dcdc38b/DeliriumOrbScarabs.png'
	} else if (props.category === 'MAP') {
		return '/src/assets/png-icons/underground-river-map.png'
	} else if (props.category === 'MAP_8_MOD') {
		return '/src/assets/png-icons/vaal-temple-map.png'
	} else if (props.category === 'BESTIARY') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQmVzdGlhcnlPcmJGdWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3214b44360/BestiaryOrbFull.png'
	} else if (props.category === 'DELVE') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGVsdmUvU2FuY3RpZmllZEZvc3NpbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/3c8e7553b5/SanctifiedFossil.png'
	}
	return ''
})
</script>
