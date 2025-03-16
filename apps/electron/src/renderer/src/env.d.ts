/// <reference types="vite/client" />

// declare module '*.vue' {
// 	import type { DefineComponent } from 'vue'
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
// 	const component: DefineComponent<{}, {}, any>
// 	export default component
// }

interface ImportMetaEnv {
	readonly VITE_NO_ATTACH_MODE: 'true' | 'false'
	readonly VITE_USE_MOCK_DATA: 'true' | 'false'
	readonly VITE_ENABLE_CLICK_OUTSIDE: 'true' | 'false'

	readonly VITE_APP_TITLE: string
	readonly VITE_USER_AGENT: string
	readonly VITE_MAIN_API_SERVER: string
	readonly VITE_CLOUDFRONT_SERVER: string

	readonly VITE_CLIENT_ID: string
	readonly VITE_BASE_REDIRECT_URL: string

	readonly VITE_POE_BASE_AUTH_URL: string
	readonly VITE_POE_BASE_TOKEN_URL: string
	readonly VITE_POE_SERVER_ENDPOINT: string

	readonly VITE_OFFER_VERSION: string
	readonly VITE_MAXIMUM_OFFER_AMOUNT: string
	readonly VITE_OFFER_TTL: string
	readonly VITE_OFFER_AUTOSYNC_INTERVAL: string
	readonly VITE_REFETCH_INTERVAL_OFFERS: string
	readonly VITE_MTN_VERSION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
