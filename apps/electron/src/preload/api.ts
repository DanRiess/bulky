import { ipcRenderer } from 'electron'
import { ShowAttachmentPanelDto } from '@shared/types/dtoOneway.types'
import { BulkyConfig } from '@shared/types/config.types'
import { OauthTokenResponse, SignableTokenStructure } from '@shared/types/auth.types'
import ipcRendererWrapper from './ipcRendererWrapper'
import { SerializedError } from '@shared/errors/serializedError'
import { PoeLeagueRecordDtoResponse } from '@shared/types/dtoResponse.types'
import { PreprocessedNinjaFile } from '@shared/types/ninja.types'
import { PoeStashTab } from '@shared/types/poe.types'
import { ProgressInfo } from 'electron-updater'
import { AppUpdateStatus } from '@shared/types/electron.types'
import { BulkyBazaarOfferDto, BulkyBazaarOfferDtoResponse, BulkyDeleteOfferDto, Category } from '@shared/types/bulky.types'
import { BulkyApiResponse } from '@shared/types/api.types'
import activeWindow from 'active-win'

export const api = {
	/**
	 * Example for bidirectional communication. Usage in Renderer:
	 * @example
	 * const result = await window.api.hello()
	 */
	hello: () => ipcRenderer.invoke('hello'),

	/**
	 * Example for one-way main -> renderer communication. Usage in Renderer:
	 * @example
	 * window.api.onMainToRendererExample(callback)
	 */
	onMainToRendererExample: (callback: Function) => ipcRenderer.on('test', (_event, value) => callback(value)),

	// example for one-way renderer -> main communication
	// renderer uses it like this: window.api.setTitle(title)
	/**
	 * Example for one-way renderer -> main communication. Usage in Renderer:
	 * @example
	 * window.api.setTitle(title)
	 */
	setTitle: (title: string) => ipcRenderer.send('set-title', title),

	// -----------------------------------------------
	// MAIN -> RENDERER ONE WAY
	onAppUpdate: (callback: (status: AppUpdateStatus, info?: ProgressInfo, error?: Error) => void) => {
		ipcRenderer.on('show-app-update-panel', (_event, status: AppUpdateStatus, info?: ProgressInfo, error?: Error) => {
			callback(status, info, error)
		})
	},

	onShowAttachmentPanel: (callback: (value: ShowAttachmentPanelDto) => void) => {
		ipcRenderer.on('show-attachment-panel', (_event, value: ShowAttachmentPanelDto) => {
			value.time = import.meta.env.VITE_NO_ATTACH_MODE === 'true' ? 10 : value.time
			callback(value)
		})
	},

	onToggleOverlayComponent: (callback: (value: boolean) => void) => {
		ipcRenderer.on('toggle-overlay-component', (_event, value: boolean) => callback(value))
	},

	onSendNotification: (callback: (notification: { type: 'trade'; ign: string; message: string; league: string }) => void) => {
		ipcRenderer.on('send-notification', (_, notification: { type: 'trade'; ign: string; message: string; league: string }) =>
			callback(notification)
		)
	},

	// -----------------------------------------------
	// RENDERER -> MAIN ONE WAY
	closeOverlay: () => ipcRenderer.send('close-overlay'),

	setIgnoreMouseEvents: (ignore: boolean) => ipcRenderer.send('set-ignore-mouse-events', ignore),

	writeConfig: (config: BulkyConfig) => ipcRenderer.send('write-config', config),

	writeStashTabs: (stashTabs: PoeStashTab[]) => ipcRenderer.send('write-stash-tabs', stashTabs),

	pasteSearch: (message: string) => ipcRenderer.send('paste-search', message),

	openExternalBrowserWindow: (url: string) => ipcRenderer.send('open-external-browser-window', url),

	// ------------------------------------------------
	// RENDERER -> MAIN BIDIRECTIONAL
	typeInChat: (message: string) => ipcRenderer.invoke('type', message),

	readConfig: () => ipcRenderer.invoke('read-config'),

	getActiveWindow: (): Promise<activeWindow.Result | undefined> => ipcRendererWrapper.invoke('get-active-window'),

	generateOauthTokens: async (): Promise<OauthTokenResponse | SerializedError> => {
		return ipcRendererWrapper.invoke('generate-oauth-tokens')
	},

	openAuthorizationCodeUrl: (): Promise<void | SerializedError> => ipcRendererWrapper.invoke('open-authorization-code-url'),

	getAuthorizationCodeUrl: (): Promise<string | SerializedError> => ipcRendererWrapper.invoke('get-authorization-code-url'),

	signTokenResponse: (tokenResponse: SignableTokenStructure): Promise<string | SerializedError> =>
		ipcRendererWrapper.invoke('sign-token-response', tokenResponse),

	getRefreshToken: (bulkyJwt: string): Promise<string | SerializedError> =>
		ipcRendererWrapper.invoke('get-refresh-token', bulkyJwt),

	redeemRefreshToken: (refreshToken: string): Promise<OauthTokenResponse | SerializedError> =>
		ipcRendererWrapper.invoke('redeem-refresh-token', refreshToken),

	getLeagues: (): Promise<PoeLeagueRecordDtoResponse> => ipcRendererWrapper.invoke('get-leagues'),

	getNinjaData: (url: string): Promise<PreprocessedNinjaFile | SerializedError> =>
		ipcRendererWrapper.invoke('get-ninja-data', url),

	getOffers: (category: Category, league: string, timestamp: number): Promise<BulkyBazaarOfferDto[] | SerializedError> =>
		ipcRendererWrapper.invoke('get-offers', category, league, timestamp),

	putOffer: (offerDto: BulkyBazaarOfferDto, jwt: string): Promise<BulkyBazaarOfferDtoResponse | SerializedError> =>
		ipcRendererWrapper.invoke('put-offer', offerDto, jwt),

	deleteOffer: (offer: BulkyDeleteOfferDto, jwt: string): Promise<BulkyApiResponse | SerializedError> =>
		ipcRendererWrapper.invoke('delete-offer', offer, jwt),
}
