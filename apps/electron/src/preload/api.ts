import { ipcRenderer } from 'electron'
import { ShowAttachmentPanelDto, ToggleOverlayComponentDto } from '@shared/types/inputDto'
import { BulkyConfig } from '@shared/types/config.types'
import { StashTab } from '@shared/types/stash.types'
import { OauthTokenResponse } from '@shared/types/auth.types'
import ipcRendererWrapper from './ipcRendererWrapper'
import { computeAuthorizationCodeUrl, generateTokenPair, openAuthorizationCodeUrlManually } from '@main/utility/oauth'
import { SerializedError } from '@shared/errors/serializedError'

export const api = {
	// example for bidirectional communication
	// renderer uses it like this: const result = await window.api.hello()
	hello: () => ipcRenderer.invoke('hello'),

	// example for one-way main -> renderer communication.
	// renderer uses it like this: window.api.onMainToRendererExample(console.log)
	onMainToRendererExample: (callback: Function) => ipcRenderer.on('test', (_event, value) => callback(value)),

	// example for one-way renderer -> main communication
	// renderer uses it like this: window.api.setTitle(title)
	setTitle: (title: string) => ipcRenderer.send('set-title', title),

	// -----------------------------------------------
	// MAIN -> RENDERER ONE WAY
	onShowAttachmentPanel: (callback: (value: ShowAttachmentPanelDto) => void) => {
		ipcRenderer.on('show-attachment-panel', (_event, value: ShowAttachmentPanelDto) => {
			value.time = import.meta.env.DEV ? 10 : value.time
			callback(value)
		})
	},

	onToggleOverlayComponent: (callback: (value: ToggleOverlayComponentDto) => void) => {
		ipcRenderer.on('toggle-overlay-component', (_event, value: ToggleOverlayComponentDto) => callback(value))
	},

	// -----------------------------------------------
	// RENDERER -> MAIN ONE WAY
	closeOverlay: () => ipcRenderer.send('close-overlay'),

	writeConfig: (config: BulkyConfig) => ipcRenderer.send('write-config', config),

	writeStashTabs: (stashTabs: StashTab[]) => ipcRenderer.send('write-stash-tabs', stashTabs),

	// ------------------------------------------------
	// RENDERER -> MAIN BIDIRECTIONAL
	typeInChat: (message: string) => ipcRenderer.invoke('type', message),

	readConfig: () => ipcRenderer.invoke('read-config'),

	readStashTabs: (): Promise<StashTab[]> => ipcRenderer.invoke('read-stash-tabs'),

	generateOauthTokens: async (): Promise<OauthTokenResponse | SerializedError> => {
		return ipcRendererWrapper.invoke<Awaited<typeof generateTokenPair>>('generate-oauth-tokens')
	},

	redeemRefreshToken: (refreshToken: string): Promise<OauthTokenResponse | SerializedError> =>
		ipcRenderer.invoke('redeem-refresh-token', refreshToken),

	openAuthorizationCodeUrl: (): Promise<void | SerializedError> =>
		ipcRendererWrapper.invoke<typeof openAuthorizationCodeUrlManually>('open-authorization-code-url'),

	getAuthorizationCodeUrl: (): Promise<string | SerializedError> =>
		ipcRendererWrapper.invoke<typeof computeAuthorizationCodeUrl>('get-authorization-code-url'),
}
