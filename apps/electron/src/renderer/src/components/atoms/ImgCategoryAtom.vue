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
	} else if (props.category === 'CATALYST') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ2F0YWx5c3RzL0NyaXRpY2FsTW9kaWZpZXJDYXRhbHlzdCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/18e5522c0e/CriticalModifierCatalyst.png'
	} else if (props.category === 'CURRENCY') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZXMiLCJzY2FsZSI6MX1d/ec48896769/CurrencyModValues.png'
	} else if (props.category === 'HEIST') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSGVpc3QvQmx1ZXByaW50Tm90QXBwcm92ZWQzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/fd4cd3685e/BlueprintNotApproved3.png'
	} else if (props.category === 'EXPEDITION') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXhwZWRpdGlvbi9CYXJ0ZXJSZWZyZXNoQ3VycmVuY3kiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/bf3e6fbe8f/BarterRefreshCurrency.png'
	} else if (props.category === 'FRAGMENT') {
		return 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9WYWFsMDQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6c797c0f93/Vaal04.png'
	}
	return ''
})
</script>
