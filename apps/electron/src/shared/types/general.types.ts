export type TradeNotification = {
	notificationType: 'trade'
	ign: string
	tradeData: string
	timestamp: number
	inviteSent: boolean
	show: boolean
	timeout: NodeJS.Timeout | undefined
}

export type SplitClientTxtLine = {
	date: string
	time: string
	code: string
	sender: string
	message: string
}
