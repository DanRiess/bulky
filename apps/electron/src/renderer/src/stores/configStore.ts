import { LEAGUE } from '@web/types/poe.types'
import { cloneDeep } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BulkyConfig } from 'src/shared/types/config.types'
import { ref } from 'vue'

export const useConfigStore = defineStore('configStore', () => {
	/** Initialized with default values */
	const config = ref<BulkyConfig>({
		version: '0.0.1',
		league: LEAGUE.AFFLICTION_SC,
		overlayKey: 'CTRL + SPACE',
		gameWindowTitle: 'Path of Exile',
	})

	async function getUserConfig() {
		try {
			const savedConfig = await window.api.readConfig()
			config.value = { ...config.value, ...savedConfig }
		} catch (e) {
			console.log('error loading user config. using default config instead.')
		}
	}

	/** Write the current config to the user config file. */
	function writeUserConfig() {
		const configClone = cloneDeep(config.value)
		window.api.writeConfig(configClone)
	}

	return {
		config,
		getUserConfig,
		writeUserConfig,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
