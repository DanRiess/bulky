<template>
	<div class="v-app-update animated-gradient-background" data-b-override>
		<h1 class="header">Bulky is updating!</h1>
	</div>
</template>

<style scoped>
.v-app-update {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
	width: max-content;
	background-color: var(--color-darker);
	border: 1px solid var(--color-dark);
	border-radius: 1rem;
	padding: 1rem;
	margin-bottom: 35%;
}

.header {
	font-size: 1.1rem;
	font-weight: 700;
}
</style>
