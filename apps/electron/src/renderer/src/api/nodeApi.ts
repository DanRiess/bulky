/**
 * This script contains functions to interact with the node API and the user's file system.
 */

import { BulkyConfig } from '@shared/types/config.types'

export const nodeApi = {
	typeInChat: async (message: string) => {
		return window.api.typeInChat(message)
	},

	openAuthorizationCodeUrl: async () => {
		return window.api.openAuthorizationCodeUrl()
	},

	getAuthorizationCodeUrl: async () => {
		return window.api.getAuthorizationCodeUrl()
	},

	generateOauthTokens: async () => {
		return window.api.generateOauthTokens()
	},

	redeemRefreshToken: async (refreshToken: string) => {
		return window.api.redeemRefreshToken(refreshToken)
	},

	readConfig: async () => {
		return window.api.readConfig()
	},

	writeConfig: async (config: BulkyConfig) => {
		return window.api.writeConfig(config)
	},
}
