<template>
	<DefaultLayout grid-template-columns="25ch minmax(0, 1fr)">
		<template #leftColumn>
			<div class="animated-gradient-background" data-b-override>
				<SettingsCategoriesMolecule />
			</div>
		</template>
		<template #rightColumn>
			<div class="animated-gradient-background" data-b-override>
				<SettingsOrganism />
			</div>
		</template>
	</DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@web/components/layouts/DefaultLayout.vue'
import SettingsCategoriesMolecule from '@web/components/molecules/SettingsCategoriesMolecule.vue'
import SettingsOrganism from '@web/components/organisms/SettingsOrganism.vue'
</script>
