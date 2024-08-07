<template>
	<div class="m-fb-bazaar-offer animated-gradient-background" data-b-override>
		<p>Sorry, there are no offers matching your current filter.</p>
		<button @click="addnote">Add notification</button>
	</div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@web/stores/notificationStore'

const notificationStore = useNotificationStore()

function addnote() {
	const n = notificationStore.createTradeNotification({
		ign: 'Chavvv',
		tradeData: '040560160128989%RX%12345',
	})

	notificationStore.addTrade(n)
}
</script>

<style scoped>
.m-fb-bazaar-offer {
	padding: 1rem 0.5rem;
	border-radius: var(--border-radius-medium);
	text-align: center;
}
</style>
