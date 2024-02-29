<template>
	<li class="a-list-item specular-glance-animation gradient-border" :class="{ active }" data-b-override>
		<slot />
	</li>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		active?: boolean
	}>(),
	{
		active: false,
	}
)
</script>

<style scoped>
.a-list-item {
	padding: 0.25rem;
	cursor: pointer;
	font-size: 1.1rem;
}

.a-list-item:not(:disabled):hover::before,
.a-list-item.active:not(:disabled)::before {
	--show-border: 1;
}

.a-list-item:not(:disabled):hover::after {
	--show-specular-effect: initial;
}
</style>
