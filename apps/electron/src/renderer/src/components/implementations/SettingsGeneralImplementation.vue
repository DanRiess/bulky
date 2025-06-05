<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>General Settings</h2>
		</header>
		<main class="main" v-if="leagueStore.isInitialized">
			<LabelWithSelectMolecule v-model="configStore.config.league" :options="leagues" :allow-freestyle-input="true">
				League:
			</LabelWithSelectMolecule>
			<LabelWithTextMolecule v-model="configStore.config.gameWindowTitle"> PoE Window Title: </LabelWithTextMolecule>
			<LabelWithButtonMolecule :button-text="moveNotificationButtonText" @click="moveNotifications">
				Move Notifications:
			</LabelWithButtonMolecule>
			<LabelWithCheckboxMolecule v-model="configStore.config.notifications.autoHideNotifications">
				Hide Notifications:
			</LabelWithCheckboxMolecule>
		</main>
		<div class="loading" v-else>
			<LoadingSpinnerAtom />
			Loading Config Settings
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import LabelWithSelectMolecule from '../molecules/LabelWithSelectMolecule.vue'
import { useLeagueStore } from '@web/stores/leagueStore'
import { computed, onMounted } from 'vue'
import LabelWithTextMolecule from '../molecules/LabelWithTextMolecule.vue'
import LoadingSpinnerAtom from '../atoms/LoadingSpinnerAtom.vue'
import LabelWithButtonMolecule from '../molecules/LabelWithButtonMolecule.vue'
import { useNotificationStore } from '@web/stores/notificationStore'
import LabelWithCheckboxMolecule from '../molecules/LabelWithCheckboxMolecule.vue'

// STORES
const configStore = useConfigStore()
const leagueStore = useLeagueStore()
const notificationStore = useNotificationStore()

// STATE
const leagues = computed(() => {
	const leagues = leagueStore.leagues?.map(l => l.id)
	if (leagues) {
		return leagues.includes(configStore.config.league) ? leagues : [...leagues, configStore.config.league]
	} else {
		return [configStore.config.league]
	}
})

// GETTERS
const moveNotificationButtonText = computed(() => {
	return notificationStore.editNotificationElement ? 'Lock' : 'Move'
})

// METHODS
function moveNotifications() {
	notificationStore.moveNotificationElement(moveNotificationButtonText.value)
}

// HOOKS
onMounted(() => {
	leagueStore.initialize()
})
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.main {
	display: grid;
	grid-template-columns: max-content max-content;
	column-gap: 2rem;
	row-gap: 0.5rem;
	margin-left: 1rem;
}

.loading {
	display: grid;
	grid-column: span 2;
	justify-items: center;
	margin-top: 12rem;
	gap: 1.5rem;
}
</style>
