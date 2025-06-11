import { DeepPartial } from '@shared/types/utility.types'
import { ApiStatus } from '@web/api/api.types'
import { nodeApi } from '@web/api/nodeApi'
import { useApi } from '@web/api/useApi'
import { deepToRaw } from '@web/utility/deepToRaw'
import { sleepTimer } from '@web/utility/sleep'
import { cloneDeep, debounce, merge } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { BulkyConfig } from 'src/shared/types/config.types'
import { ref, watch } from 'vue'

export const useConfigStore = defineStore('configStore', () => {
	// DEFAULT VALUES
	const DEFAULT_CONFIG: BulkyConfig = {
		version: '0.0.1',
		league: 'Standard',
		gameWindowTitle: 'Path of Exile',
		ign: '',
		autoRefetchOffers: false,
		notifications: {
			autoHideNotifications: false,
			offsetBottom: 90,
			offsetRight: 16,
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
		shop: {
			/** Offers worth less than that won't be auto uploaded. Manual upload still possible. */
			autoUploadPriceFloor: Number(import.meta.env.VITE_AUTO_UPLOAD_PRICE_FLOOR),
			/** Default value for minimum buyout for new offers. */
			defaultMinBuyout: {
				chaos: 0,
				divine: 0,
			},
		},
		bazaar: {
			/** Option to display the current user's posted offers in their bazaar. */
			showMyOffers: false,
		},
	}

	// STATE
	const config = ref<BulkyConfig>(DEFAULT_CONFIG)
	let writeStatus: ApiStatus = 'IDLE'

	async function getUserConfig() {
		const request = useApi('readConfigRequest', nodeApi.readConfig)
		await request.exec()

		if (request.error.value || !request.data.value) {
			console.log(request.error.value)
			return
		}

		updateAndValidateConfig(request.data.value)
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
		writeStatus = 'IDLE'
	}

	/**
	 * Reset the config to default.
	 */
	function resetConfig() {
		config.value = DEFAULT_CONFIG
	}

	/**
	 * Validate config parameters.
	 * Use writable computed properties for settings v-models and call this function
	 * in the setter with the new value.
	 */
	function updateAndValidateConfig(partialConfig: DeepPartial<BulkyConfig>) {
		// Create a temporary new version of the config
		const newConfig = deepToRaw(config.value)
		merge(newConfig, partialConfig)

		// League must be a string.
		if (typeof newConfig.league !== 'string') {
			newConfig.league = DEFAULT_CONFIG.league
		}

		// Game Window Title must be a string.
		if (typeof newConfig.gameWindowTitle !== 'string') {
			newConfig.gameWindowTitle = DEFAULT_CONFIG.gameWindowTitle
		}

		// Ingame Name must be a string.
		if (typeof newConfig.ign !== 'string') {
			newConfig.ign = DEFAULT_CONFIG.ign
		}

		// Auto refetch offer functionality is currently unavailable.
		// It messed up UI list rendering and needs to be disabled for the time being.
		newConfig.autoRefetchOffers = false

		// Handle notification settings.
		if (typeof newConfig.notifications.autoHideNotifications !== 'boolean') {
			newConfig.notifications.autoHideNotifications = DEFAULT_CONFIG.notifications.autoHideNotifications
		}
		if (typeof newConfig.notifications.offsetBottom !== 'number') {
			newConfig.notifications.offsetBottom = DEFAULT_CONFIG.notifications.offsetBottom
		}
		if (typeof newConfig.notifications.offsetRight !== 'number') {
			newConfig.notifications.offsetRight = DEFAULT_CONFIG.notifications.offsetRight
		}

		// Hotkey optional options has to be a boolean.
		if (typeof newConfig.hotkeySettings.enableOptionalKeys !== 'boolean') {
			newConfig.hotkeySettings.enableOptionalKeys = DEFAULT_CONFIG.hotkeySettings.enableOptionalKeys
		}

		// Handle Shop settings.
		// Auto upload price floor has to be a number higher equal to or higher than the default value.
		if (typeof newConfig.shop.autoUploadPriceFloor !== 'number') {
			newConfig.shop.autoUploadPriceFloor = DEFAULT_CONFIG.shop.autoUploadPriceFloor
		} else {
			newConfig.shop.autoUploadPriceFloor = Math.round(
				Math.max(DEFAULT_CONFIG.shop.autoUploadPriceFloor, newConfig.shop.autoUploadPriceFloor)
			)
		}

		// Default min buyout values have to be positive integers or 0.
		if (typeof newConfig.shop.defaultMinBuyout.divine !== 'number') {
			newConfig.shop.defaultMinBuyout.divine = DEFAULT_CONFIG.shop.defaultMinBuyout.divine
		} else {
			newConfig.shop.defaultMinBuyout.divine = Math.round(
				Math.max(newConfig.shop.defaultMinBuyout.divine, DEFAULT_CONFIG.shop.defaultMinBuyout.divine)
			)
		}

		if (typeof newConfig.shop.defaultMinBuyout.chaos !== 'number') {
			newConfig.shop.defaultMinBuyout.chaos = DEFAULT_CONFIG.shop.defaultMinBuyout.chaos
		} else {
			newConfig.shop.defaultMinBuyout.chaos = Math.round(
				Math.max(newConfig.shop.defaultMinBuyout.chaos, DEFAULT_CONFIG.shop.defaultMinBuyout.chaos)
			)
		}

		// Show my offers has to be a boolean
		if (typeof newConfig.bazaar.showMyOffers !== 'boolean') {
			newConfig.bazaar.showMyOffers = DEFAULT_CONFIG.bazaar.showMyOffers
		}

		config.value = newConfig
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

	return {
		config,
		getUserConfig,
		resetConfig,
		updateAndValidateConfig,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
