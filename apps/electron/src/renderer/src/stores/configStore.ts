import { ApiStatus } from '@web/api/api.types'
import { nodeApi } from '@web/api/nodeApi'
import { useApi } from '@web/api/useApi'
import { sleepTimer } from '@web/utility/sleep'
import { cloneDeep, debounce } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BulkyConfig } from 'src/shared/types/config.types'
import { ref, watch } from 'vue'

export const useConfigStore = defineStore('configStore', () => {
	/** Initialized with default values */
	const config = ref<BulkyConfig>({
		version: '0.0.1',
		league: 'Standard',
		gameWindowTitle: 'Path of Exile',
		ign: '',
		autoRefetchOffers: true,
		notifications: {
			offsetBottom: '90px',
			offsetRight: '1rem',
		},
		hotkeySettings: {
			keys: {
				appToggle: {
					keyCode: 'CTRL+SPACE',
					displayName: 'Toggle App',
					required: true,
				},
				hideout: {
					keyCode: '',
					displayName: 'Hideout',
					required: false,
				},
			},
			enableOptionalKeys: false,
		},
	})
	let writeStatus: ApiStatus = 'IDLE'

	async function getUserConfig() {
		const request = useApi('readConfigRequest', nodeApi.readConfig)
		await request.exec()

		if (request.error.value || !request.data.value) {
			console.log(request.error.value)
			return
		}

		config.value = { ...config.value, ...request.data.value }
	}

	/**
	 * Write the current config to the user config file.
	 * Don't expose this function by returning it.
	 * It should only be called from this store with the debounce function below.
	 */
	async function writeUserConfig() {
		writeStatus = 'PENDING'
		const configClone = cloneDeep(config.value)
		const request = useApi('writeConfigRequest', nodeApi.writeConfig)
		await request.exec(configClone)

		if (request.error.value) {
			console.log(request.error.value)
		}
		writeStatus = 'IDLE'
	}

	const debounceWriteConfig = debounce(writeUserConfig, 500)

	/**
	 * Whenever the config changes, write it to the config file.
	 */
	watch(
		config,
		async () => {
			while (writeStatus !== 'IDLE') {
				await sleepTimer(100)
			}
			debounceWriteConfig()
		},
		{ deep: true }
	)

	watch(
		() => config.value.league,
		league => {
			console.log(league)
		}
	)

	return {
		config,
		getUserConfig,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
