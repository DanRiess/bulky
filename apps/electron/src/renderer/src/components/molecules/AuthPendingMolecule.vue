<template>
	<div class="m-auth-pending">
		<header class="header">
			<h1>Sign in from your browser to continue</h1>
		</header>
		<p>
			If your browser hasn't opened a Path of Exile tab for you to sign in,
			<span class="highlight" @click="emit('openSignInPage')">open it manually</span> or
			<span class="highlight" @click="emit('copySignInUrl')">copy the URL</span>.
		</p>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	openSignInPage: []
	copySignInUrl: []
}>()
</script>

<style scoped>
.m-auth-pending {
	display: grid;
	gap: 1.5rem;
}

.highlight {
	color: transparent;
	background-image: linear-gradient(20deg, var(--dr-gradient-from-bright), var(--dr-gradient-to-bright));
	background-clip: text;
	font-weight: 500;
	cursor: pointer;
}
</style>
