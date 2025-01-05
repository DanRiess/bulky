import { ObjectValues } from './utility.types'

export const SETTINGS_CATEGORY = {
	GENERAL: 'GENERAL',
	HOTKEYS: 'HOTKEYS',
} as const

export type SettingsCategory = ObjectValues<typeof SETTINGS_CATEGORY>
