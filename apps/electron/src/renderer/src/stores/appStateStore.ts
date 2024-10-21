/**
 * handle state related to the entire application here.
 * i. e. which category is selected, toggled menus, etc
 */

import { Category } from '@shared/types/bulky.types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStateStore = defineStore('appStateStore', () => {
	const appActive = ref(true)
	const selectedCategory = ref<Category>('ESSENCE')

	return {
		selectedCategory,
		appActive,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStateStore, import.meta.hot))
}
