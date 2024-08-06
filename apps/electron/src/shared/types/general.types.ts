export type TradeNotification = {
	notificationType: 'trades'
	ign: string
	tradeData: string
	timestamp: number
	inviteSent: boolean
	show: boolean
	timeout: NodeJS.Timeout | undefined
}
