<template>
	<div class="a-notification-button gradient-border" data-b-override>
		<SvgIconAtom name="notifications" width="48" />
	</div>
</template>

<script setup lang="ts">
import SvgIconAtom from './SvgIconAtom.vue'
</script>

<style scoped>
.a-notification-button {
	position: absolute !important;
	bottom: 1rem;
	right: 1rem;
	background-color: black;
	width: 3rem;
	height: 3rem;
	border-radius: var(--border-radius-small);
	pointer-events: all;
	border-width: 2px;
	cursor: pointer;
}

.a-notification-button:hover {
	--show-border: 1;
}
</style>
