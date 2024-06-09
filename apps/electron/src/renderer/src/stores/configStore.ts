import { nodeApi } from '@web/api/nodeApi'
import { useApi } from '@web/api/useApi'
import { cloneDeep } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BulkyConfig } from 'src/shared/types/config.types'
import { ref } from 'vue'

export const useConfigStore = defineStore('configStore', () => {
	/** Initialized with default values */
	const config = ref<BulkyConfig>({
		version: '0.0.1',
		league: 'Standard',
		overlayKey: 'CTRL + SPACE',
		gameWindowTitle: 'Path of Exile',
		ign: '',
	})

	async function getUserConfig() {
		const request = useApi('readConfigRequest', nodeApi.readConfig)
		await request.exec()

		if (request.error.value || !request.data.value) {
			console.log(request.error.value)
			return
		}

		config.value = { ...config.value, ...request.data.value }
	}

	/** Write the current config to the user config file. */
	async function writeUserConfig() {
		const configClone = cloneDeep(config.value)
		const request = useApi('writeConfigRequest', nodeApi.writeConfig)
		await request.exec(configClone)

		if (request.error.value) {
			console.log(request.error.value)
		}
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
