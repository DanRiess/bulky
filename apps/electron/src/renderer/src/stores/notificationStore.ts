import { TradeNotification } from '@shared/types/general.types'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useNotificationStore = defineStore('notificationStore', () => {
	const forceShowTradeNotifications = ref(false)
	const forceHideTradeNotifications = ref(false)
	const notifications = ref<{ trades: TradeNotification[] }>({
		trades: [],
	})

	/**
	 * Create a trade notification.
	 */
	function createTradeNotification(options: { ign: string; tradeData: string }) {
		return ref<TradeNotification>({
			notificationType: 'trades',
			ign: options.ign,
			tradeData: options.tradeData,
			timestamp: Date.now(),
			timeout: undefined,
			inviteSent: false,
			show: forceHideTradeNotifications.value === true ? false : true,
		})
	}

	/**
	 * Add a trade notification to the array.
	 */
	function addTrade(notification: Ref<TradeNotification>) {
		notifications.value.trades.push(notification.value)

		// If notifications are not toggled, new notifications should vanish after 5s.
		if (forceShowTradeNotifications.value === false) {
			notification.value.timeout = setTimeout(() => {
				notification.value.show = false
			}, 5000)
		}
	}

	/**
	 * Toggle all trade notifications on or off.
	 */
	function toggleTradeNotifications(toggle?: boolean) {
		forceShowTradeNotifications.value = toggle === undefined ? !forceShowTradeNotifications.value : toggle

		if (forceShowTradeNotifications.value === true) {
			notifications.value.trades.forEach(n => {
				n.show = true

				// Also clear the timeout in this case. Once notifications are force toggled, they shouldn't vanish anymore.
				clearTimeout(n.timeout)
			})
		} else {
			notifications.value.trades.forEach(n => {
				n.show = false
			})
		}
	}

	// function add (notification: Ref<TradeNotification>) {
	// 	notifications.value[notification.value.notificationType].push(notification.value)

	// 	if (notification.value.status === 'PENDING' || notification.value.status === 'IDLE') {
	// 		const unwatch = watch(
	// 			() => notification.value.status,
	// 			status => {
	// 				if (status === 'SUCCESS' || status === 'ERROR') {
	// 					notification.value.timeout = setTimeout(() => {
	// 						removeNotification(notification.value)
	// 					}, notification.value.ttl ?? GENERIC_TTL)
	// 					unwatch()
	// 				}
	// 			}
	// 		)
	// 	} else {
	// 		notification.value.timeout = setTimeout(() => {
	// 			remove(notification.value)
	// 		}, notification.value.ttl ?? GENERIC_TTL)
	// 	}
	// }

	// function resetTimeout(notification: Notification) {
	// 	clearTimeout(notification.timeout)
	// 	notification.timeout = setTimeout(() => {
	// 		remove(notification)
	// 	}, notification.ttl ?? GENERIC_TTL)
	// }

	function remove(notification: TradeNotification) {
		notifications.value.trades = notifications.value.trades.filter(item => item.timestamp !== notification.timestamp)

		if (notifications.value.trades.length === 0) {
			forceShowTradeNotifications.value = false
		}
	}

	return {
		notifications,
		forceShowTradeNotifications,
		forceHideTradeNotifications,
		createTradeNotification,
		addTrade,
		toggleTradeNotifications,
		remove,
	}
})
