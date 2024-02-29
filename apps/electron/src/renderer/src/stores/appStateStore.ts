/**
 * handle state related to the entire application here.
 * i. e. which category is selected, toggled menus, etc
 */

import { Category, MainView } from '@web/types/bulky.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStateStore = defineStore('appStateStore', () => {
	// should probably globally type this and use in components later
	const selectedView = ref<MainView>('BUY')
	const selectedCategory = ref<Category>('COMPASS')

	return {
		selectedView,
		selectedCategory,
	}
})
