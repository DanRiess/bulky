<template>
	<button class="m-support-me-so-i-dont-have-to-sell-my-body gradient-border" data-b-override @click="openKofi">
		<div class="top">Support me on</div>
		<div class="bottom">
			<SvgIconAtom name="kofi-logo" height="1.5rem" width="100%" />
		</div>
	</button>
</template>

<script setup lang="ts">
import { nodeApi } from '@web/api/nodeApi'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

function openKofi() {
	nodeApi.openExternalBrowserWindow('https://ko-fi.com/chavincar')
}
</script>

<style scoped>
.m-support-me-so-i-dont-have-to-sell-my-body {
	padding: 0.25rem 0.5rem;
	background-image: radial-gradient(circle at 50% 75%, transparent, rgb(255 255 255 / 0.1)),
		linear-gradient(-45deg, var(--dr-gradient-from-dark), var(--dr-gradient-to-dark));
	color: inherit;
	width: max-content;
	height: max-content;
	outline: none;
	cursor: pointer;
}

.m-support-me-so-i-dont-have-to-sell-my-body:hover {
	--show-border: 1;
}

.bottom {
	margin-top: 0.25rem;
	padding-bottom: 0.2rem;
}
</style>
