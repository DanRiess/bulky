import { ObjectValues } from '@shared/types/utility.types'
import { SCARAB_TYPE } from './scarab.const'
import { BulkyBazaarItemBase, BulkyShopItemBase, CATEGORY } from '@shared/types/bulky.types'

/** All possible scarab base types */
export type ScarabType = ObjectValues<typeof SCARAB_TYPE>

export type ScarabTier = '0'

/** BulkyShopItem implementation for the scarab category */
export type ShopScarab = BulkyShopItemBase<typeof CATEGORY.SCARAB> & {
	type: ScarabType
	tier: ScarabTier
}

/** BulkyBazaarItem implementation for the scarab category */
export type BazaarScarab = BulkyBazaarItemBase & {
	type: ScarabType
	tier: ScarabTier
}
