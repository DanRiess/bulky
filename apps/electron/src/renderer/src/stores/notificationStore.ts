import { ErrorNotification, TradeNotification } from '@shared/types/general.types'
import { defineStore } from 'pinia'
import { computed, MaybeRef, Ref, ref, toValue, watch } from 'vue'
import { useConfigStore } from './configStore'
import { ApiStatus } from '@web/api/api.types'

const DEFAULT_ERROR_TTL = 5000

export const useNotificationStore = defineStore('notificationStore', () => {
	// STORES
	const configStore = useConfigStore()

	// STATE
	const forceShowTradeNotifications = ref(false)
	const forceHideTradeNotifications = computed(() => configStore.config.notifications.autoHideNotifications)
	const editNotificationElement = ref(false)
	const dummyNotification = ref<TradeNotification>()
	const notifications = ref<{ trades: TradeNotification[]; errors: ErrorNotification[] }>({
		trades: [],
		errors: [],
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
	 * Create an error notification
	 */
	function createErrorNotification(
		options: { message: string; ttl?: number },
		status: ApiStatus = 'ERROR'
	): Ref<ErrorNotification> {
		return ref<ErrorNotification>({
			notificationType: 'error',
			message: options.message,
			status,
			timestamp: Date.now(),
			ttl: options.ttl ?? DEFAULT_ERROR_TTL,
			timeout: undefined,
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

	function addErrorNotification(notification: Ref<ErrorNotification>) {
		if (notificationExists(notification)) return

		notifications.value.errors.push(notification.value)

		if (notification.value.status === 'PENDING' || notification.value.status === 'IDLE') {
			const unwatch = watch(
				() => notification.value.status,
				status => {
					if (status === 'SUCCESS' || status === 'ERROR') {
						notification.value.timeout = setTimeout(() => {
							remove(notification.value)
						}, notification.value.ttl ?? DEFAULT_ERROR_TTL)
						unwatch()
					}
				}
			)
		} else {
			notification.value.timeout = setTimeout(() => {
				remove(notification.value)
			}, notification.value.ttl ?? DEFAULT_ERROR_TTL)
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

	function remove(notification: TradeNotification | ErrorNotification) {
		if (notification.notificationType === 'trade') {
			notifications.value.trades = notifications.value.trades.filter(item => item.timestamp !== notification.timestamp)
			if (notifications.value.trades.length === 0) {
				forceShowTradeNotifications.value = false
			}
		} else if (notification.notificationType === 'error') {
			notifications.value.errors = notifications.value.errors.filter(item => item.timestamp !== notification.timestamp)
		}
	}

	function resetTimeout(notification: ErrorNotification) {
		clearTimeout(notification.timeout)
		notification.timeout = setTimeout(() => {
			remove(notification)
		}, notification.ttl ?? DEFAULT_ERROR_TTL)
	}

	function notificationExists(notification: MaybeRef<TradeNotification | ErrorNotification>) {
		const plainNotification = toValue(notification)
		if (plainNotification.notificationType === 'trade') {
			return !!notifications.value.trades.find(
				n => n.ign === plainNotification.ign && n.tradeData === plainNotification.tradeData
			)
		} else if (plainNotification.notificationType === 'error') {
			return !!notifications.value.errors.find(n => n.timestamp === plainNotification.timestamp)
		} else {
			return false
		}
	}

	function createDummyNotification() {
		const dummyData = {
			ign: 'BulkyTestDummy',
			tradeData: `1%4%150%AEAADwAAABJBmAAA%"!gen|f el|s rec" "m q.*1[1-9].%"`,
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
		createErrorNotification,
		addErrorNotification,
		moveNotificationElement,
		remove,
		resetTimeout,
	}
})
