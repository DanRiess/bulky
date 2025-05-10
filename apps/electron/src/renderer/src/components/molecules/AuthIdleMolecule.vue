<template>
	<div class="m-auth-pending">
		<header class="header">
			<h1>Sign in with pathofexile.com</h1>
		</header>
		<p>Use your pathofexile.com account to sign in securely. Bulky will not store your credentials or personal data.</p>
		<p>
			If the button doesn't work,
			<span class="highlight" @click="emit('copySignInUrl')">copy the URL</span> and paste it into your preferred browser.
		</p>
		<ButtonAtom background-color="dark" @click="emit('startOauthFlow')"> Sign In </ButtonAtom>
	</div>
</template>

<script setup lang="ts">
import ButtonAtom from '../atoms/ButtonAtom.vue'

const emit = defineEmits<{
	startOauthFlow: []
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
