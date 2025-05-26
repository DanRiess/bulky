export type BulkyHotkeyStruct = {
	keyCode: string
	displayName: string
	required: boolean
}

export type BulkyConfig = {
	version: string
	league: string
	gameWindowTitle: string
	ign: string
	autoRefetchOffers: boolean
	notifications: {
		offsetBottom: string
		offsetRight: string
	}
	hotkeySettings: {
		keys: {
			appToggle: BulkyHotkeyStruct
			hideout: BulkyHotkeyStruct
		}
		enableOptionalKeys: boolean
	}
	shop: {
		autoUploadPriceFloor: number
		defaultMinBuyout: number
	}
	bazaar: {
		showMyOffers: boolean
	}
}
