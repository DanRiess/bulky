<template>
	<div class="i-settings flow">
		<header class="header">
			<h2>Hotkey Settings</h2>
		</header>
		<main class="main">
			<section class="hotkey-section flow">
				<h3>Required key bindings</h3>
				<ul class="hotkey-list">
					<HotkeyInputMolecule
						v-for="keyStruct in hotkeysByCategory.required"
						v-model="keyStruct.keyCode"
						:key-struct="keyStruct">
						{{ keyStruct.displayName }}
					</HotkeyInputMolecule>
				</ul>
			</section>
			<section class="hotkey-section flow">
				<h3>Optional key bindings</h3>
				<p class="disclaimer">
					If you are using other third party tools with key bind settings (for example Awakened PoE Trade), it is
					strongly recommended to disable this section to avoid binding multiple actions to one key by accident. This
					would be against GGGs ToS and could get you banned.
				</p>
				<ul class="hotkey-list">
					<HotkeyInputMolecule
						v-for="keyStruct in hotkeysByCategory.optional"
						v-model="keyStruct.keyCode"
						:key-struct="keyStruct">
						{{ keyStruct.displayName }}
					</HotkeyInputMolecule>
				</ul>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HotkeyInputMolecule from '../molecules/HotkeyInputMolecule.vue'
import { useConfigStore } from '@web/stores/configStore'
import { BulkyHotkeyStruct } from '@shared/types/config.types'
import { getKeys } from '@shared/types/utility.types'

// STORES
const configStore = useConfigStore()
console.log(configStore.config)

// GETTERS
const hotkeysByCategory = computed(() => {
	return getKeys(configStore.config.hotkeySettings.keys).reduce(
		(result, curr) => {
			if (configStore.config.hotkeySettings.keys[curr].required) {
				result.required.push(configStore.config.hotkeySettings.keys[curr])
			} else {
				result.optional.push(configStore.config.hotkeySettings.keys[curr])
			}
			return result
		},
		{ required: [], optional: [] } as { required: BulkyHotkeyStruct[]; optional: BulkyHotkeyStruct[] }
	)
})
</script>

<style scoped>
.i-settings {
	padding: 0.5rem;
}

.hotkey-section {
	margin-top: 2rem;
	margin-left: 1rem;
}

.hotkey-list {
	display: grid;
	grid-template-columns: 8rem max-content;
	column-gap: 2rem;
	row-gap: 0.5rem;
	margin-left: 0.5rem;
}

.disclaimer {
	margin-inline: 1.5rem;
	font-size: 0.85em;
}
</style>
