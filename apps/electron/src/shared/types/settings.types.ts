import { ObjectValues } from './utility.types'

export const SETTINGS_CATEGORY = {
	GENERAL: 'GENERAL',
	HOTKEYS: 'HOTKEYS',
	BAZAAR: 'BAZAAR',
	SHOP: 'SHOP',
} as const

export type SettingsCategory = ObjectValues<typeof SETTINGS_CATEGORY>
