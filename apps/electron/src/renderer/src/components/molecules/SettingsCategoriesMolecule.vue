<template>
	<div class="m-config-categories flow">
		<header class="header no-select">
			<h2>Categories</h2>
		</header>
		<ul class="category-list">
			<ListItemAtom
				v-for="option in settingsOptions"
				:key="option.category"
				:active="option.category === settingsCategoryModel"
				@click="settingsCategoryModel = option.category">
				{{ option.displayValue }}
			</ListItemAtom>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { SETTINGS_CATEGORY, SettingsCategory } from '@shared/types/settings.types'
import ListItemAtom from '../atoms/ListItemAtom.vue'
import { ref } from 'vue'
import { getKeys } from '@shared/types/utility.types'
import { BULKY_TRANSFORM } from '@web/utility/transformers'

// LOCAL TYPES
type SettingsOption = {
	category: SettingsCategory
	displayValue: string
}

// MODEL
const settingsCategoryModel = defineModel<SettingsCategory>({ required: true })

// STATE
const settingsOptions = ref<SettingsOption[]>(
	getKeys(SETTINGS_CATEGORY).map(category => ({
		category: category,
		displayValue: BULKY_TRANSFORM.stringToDisplayValue(category),
	}))
)
</script>

<style scoped>
.m-config-categories {
	padding: 0.5rem;
	list-style: none;
}

.category-list {
	margin-left: 1rem;
}
</style>
