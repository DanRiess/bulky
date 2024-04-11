/**
 * handle state related to the entire application here.
 * i. e. which category is selected, toggled menus, etc
 */

import { Category, MainView, SellView } from '@shared/types/bulky.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStateStore = defineStore('appStateStore', () => {
	const selectedView = ref<MainView>('BUY')
	const selectedSellView = ref<SellView>('LIST')
	const selectedCategory = ref<Category>('COMPASS')

	return {
		selectedView,
		selectedSellView,
		selectedCategory,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStateStore, import.meta.hot))
}
