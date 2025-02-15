import { readConfig } from '@main/ipcCallbacks/configActions'
import { app } from 'electron'

/**
 * Singleton to keep global app state.
 */
export class AppStateStore {
	static #instance: AppStateStore

	public appToggleHotkey: string
	public gameWindowTitle: string

	private constructor() {
		this.appToggleHotkey = 'CTRL+SPACE'
		this.gameWindowTitle = 'Path of Exile'
		this.initialize()
	}

	public static get instance(): AppStateStore {
		if (!AppStateStore.#instance) {
			AppStateStore.#instance = new AppStateStore()
		}

		return AppStateStore.#instance
	}

	/**
	 * Execute all necessary async operations for the initial state.
	 */
	private async initialize() {
		const config = await readConfig(app)

		this.appToggleHotkey = config.hotkeySettings.keys.appToggle.keyCode
		this.gameWindowTitle = config.gameWindowTitle
	}
}
