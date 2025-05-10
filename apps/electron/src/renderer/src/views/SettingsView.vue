<template>
	<DefaultLayout grid-template-columns="25ch minmax(0, 1fr)">
		<template #leftColumn>
			<div class="animated-gradient-background settings-container" data-b-override>
				<SettingsCategoriesMolecule v-model="activeCategory" />
			</div>
		</template>
		<template #rightColumn>
			<div class="animated-gradient-background settings-container" data-b-override>
				<SettingsOrganism :active-category="activeCategory" />
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import { SettingsCategory } from '@shared/types/settings.types'
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import SettingsCategoriesMolecule from '@web/components/molecules/SettingsCategoriesMolecule.vue'
import SettingsOrganism from '@web/components/organisms/SettingsOrganism.vue'
import { ref } from 'vue'

// STATE
const activeCategory = ref<SettingsCategory>('GENERAL')
</script>

<style scoped>
.settings-container {
	border-radius: var(--border-radius-small);
	position: relative;
}
</style>
