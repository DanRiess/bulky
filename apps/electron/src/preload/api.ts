import { ipcRenderer } from 'electron'
import { ShowAttachmentPanelDto, ToggleOverlayComponentDto } from '../shared/types/inputDto'
import { BulkyConfig } from '@shared/types/config.types'
import { StashTab } from '@shared/types/stash.types'
import { OauthTokenResponse } from '@shared/types/auth.types'

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

	// MAIN -> RENDERER ONE WAY
	onShowAttachmentPanel: (callback: (value: ShowAttachmentPanelDto) => void) => {
		ipcRenderer.on('show-attachment-panel', (_event, value: ShowAttachmentPanelDto) => callback(value))
	},

	onToggleOverlayComponent: (callback: (value: ToggleOverlayComponentDto) => void) => {
		ipcRenderer.on('toggle-overlay-component', (_event, value: ToggleOverlayComponentDto) => callback(value))
	},

	onSendOauthAuthorizationCode: (callback: (value: { code: string }) => void) => {
		ipcRenderer.on('send-oauth-authorization-code', (_, value: { code: string }) => callback(value))
	},

	// RENDERER -> MAIN ONE WAY
	closeOverlay: () => ipcRenderer.send('close-overlay'),

	writeConfig: (config: BulkyConfig) => ipcRenderer.send('write-config', config),

	writeStashTabs: (stashTabs: StashTab[]) => ipcRenderer.send('write-stash-tabs', stashTabs),

	startOauthRedirectServer: () => ipcRenderer.send('start-oauth-redirect-server'),

	cancelOauthRequest: () => ipcRenderer.send('cancel-oauth-request'),

	// RENDERER -> MAIN BIDIRECTIONAL
	typeInChat: (message: string) => ipcRenderer.invoke('type', message),

	readConfig: () => ipcRenderer.invoke('read-config'),

	readStashTabs: (): Promise<StashTab[]> => ipcRenderer.invoke('read-stash-tabs'),

	getOauthResponse: (): Promise<OauthTokenResponse> => ipcRenderer.invoke('get-oauth-request'),
}
