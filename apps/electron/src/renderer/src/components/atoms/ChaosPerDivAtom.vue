<template>
	<div class="chaos-per-div">
		Ratio: 1
		<img src="/src/assets/png-icons/currency-divine.png" height="24" width="24" decoding="async" loading="lazy" />
		=
		{{ chaosPerDiv }}
		<img src="/src/assets/png-icons/currency-chaos.png" height="24" width="24" decoding="async" loading="lazy" />
	</div>
</template>

<script setup lang="ts">
defineProps<{
	chaosPerDiv: number
}>()
</script>

<style scoped>
.chaos-per-div {
	display: flex;
}
</style>
