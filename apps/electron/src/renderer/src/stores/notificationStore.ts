import { TradeNotification } from '@shared/types/general.types'
import { defineStore } from 'pinia'
import { computed, MaybeRef, Ref, ref, toValue } from 'vue'
import { useConfigStore } from './configStore'

export const useNotificationStore = defineStore('notificationStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const forceShowTradeNotifications = ref(false)
	const forceHideTradeNotifications = computed(() => configStore.config.notifications.autoHideNotifications)
	const editNotificationElement = ref(false)
	const dummyNotification = ref<TradeNotification>()
	const notifications = ref<{ trades: TradeNotification[] }>({
		trades: [],
	})

	/**
	 * Create a trade notification.
	 */
	function createTradeNotification(options: { ign: string; tradeData: string; league: string }): Ref<TradeNotification> {
		return ref<TradeNotification>({
			notificationType: 'trade',
			league: options.league,
			ign: options.ign,
			tradeData: options.tradeData,
			timestamp: Date.now(),
			timeout: undefined,
			inviteSent: false,
			show: !forceHideTradeNotifications.value,
		})
	}

	/**
	 * Add a trade notification to the array.
	 */
	function addTrade(notification: Ref<TradeNotification>) {
		// Don't add trade if it already exists
		if (notificationExists(notification)) return

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

	function remove(notification: TradeNotification) {
		notifications.value.trades = notifications.value.trades.filter(item => item.timestamp !== notification.timestamp)

		if (notifications.value.trades.length === 0) {
			forceShowTradeNotifications.value = false
		}
	}

	function notificationExists(notification: MaybeRef<TradeNotification>) {
		return !!notifications.value.trades.find(
			n => n.ign === toValue(notification).ign && n.tradeData === toValue(notification).tradeData
		)
	}

	function createDummyNotification() {
		const dummyData = {
			ign: 'Dummy',
			tradeData: `1%4%AEAADwAAABJBmAAA%"!gen|f el|s rec" "m q.*1[1-9].%"`,
			league: 'Standard',
		}
		const notification = createTradeNotification(dummyData)
		addTrade(notification)

		return notification
	}

	function moveNotificationElement(action: 'Move' | 'Lock') {
		if (action === 'Move') {
			editNotificationElement.value = true

			if (notifications.value.trades.length === 0) {
				dummyNotification.value = createDummyNotification().value
			}
		} else {
			editNotificationElement.value = false

			if (dummyNotification.value) {
				remove(dummyNotification.value)
			}
		}
	}

	return {
		notifications,
		forceShowTradeNotifications,
		forceHideTradeNotifications,
		editNotificationElement,
		createTradeNotification,
		addTrade,
		toggleTradeNotifications,
		moveNotificationElement,
		remove,
	}
})
