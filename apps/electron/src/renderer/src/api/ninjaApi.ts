/**
 * This script contains functions to interact with the poe.ninja API.
 */

import { PoeNinjaCategory, PoeNinjaCurrencyLine, PoeNinjaItemLine } from '@shared/types/ninja.types'
import { useConfigStore } from '@web/stores/configStore'
import api from './api.wrapper'

export const ninjaApi = {
	getCategory: async (category: PoeNinjaCategory) => {
		const configStore = useConfigStore()

		// Compute the url
		const overview = category === 'Currency' || category === 'Fragment' ? 'currency' : 'item'
		const url = `https://poe.ninja/api/data/${overview}overview?league=${configStore.config.league}&type=${category}`

		if (overview === 'currency') {
			return api.get<Record<'lines', PoeNinjaCurrencyLine[]>>(url)
		} else {
			return api.get<Record<'lines', PoeNinjaItemLine[]>>(url)
		}
	},
}

// /**
//  * Check if the passed function is a member of poeApi
//  */
// export function isNinjaApiFunction(fn: Function) {
// 	return Object.keys(ninjaApi).find(name => ninjaApi[name] === fn)
// }
