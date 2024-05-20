/**
 * This composable exposes changeable state as refs to use in components.
 * It computes a finished offer based on those values.
 */

import { BulkyItem, BulkyOffer } from '@shared/types/bulky.types'
import { useAppStateStore } from '@web/stores/appStateStore'
import { useAuthStore } from '@web/stores/authStore'
import { useConfigStore } from '@web/stores/configStore'
import { BULKY_UUID } from '@web/utility/uuid'
import { Ref, computed, ref } from 'vue'

export function useOffer<T extends BulkyItem = BulkyItem>(chaosPerDiv: number) {
	const appStateStore = useAppStateStore()
	const authStore = useAuthStore()
	const configStore = useConfigStore()

	// STATE
	const uuid = BULKY_UUID.generateTypedUuid<BulkyOffer<T>>()
	const ign = ref('')
	const multiplier = ref(1)
	const minimumBuyout = ref(0)
	const fullBuyout = ref(false)
	const items: Ref<T[]> = ref([]) // https://github.com/vuejs/core/issues/2136

	// GETTERS
	const offer = computed<BulkyOffer<T> | undefined>(() => {
		// An offer can only be generated with a signed in user.
		if (!authStore.profile) return undefined

		// An offer needs to have a valid league
		if (configStore.config.league === '') return undefined

		// An offer needs an ign to contact.
		if (ign.value === '') return undefined

		// An offer needs at least one item.
		if (items.value.length === 0) return undefined

		return {
			uuid,
			user: authStore.profile.name ?? '',
			ign: ign.value,
			league: configStore.config.league,
			category: appStateStore.selectedCategory,
			chaosPerDiv,
			multiplier: multiplier.value,
			minimumBuyout: minimumBuyout.value,
			fullBuyout: fullBuyout.value,
			items: items.value,
		}
	})

	return {
		ign,
		multiplier,
		minimumBuyout,
		fullBuyout,
		items,
		offer,
	}
}
