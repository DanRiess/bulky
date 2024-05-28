import { ObjectValues } from '@shared/types/utility.types'
import { SCARAB_TYPE } from './scarab.const'
import { BulkyItemBase, CATEGORY } from '@shared/types/bulky.types'

/** All possible scarab base types */
export type ScarabType = ObjectValues<typeof SCARAB_TYPE>

export type ScarabTier = '0'

/** BulkyItem implementation for the scarab category */
export type Scarab = BulkyItemBase<typeof CATEGORY.SCARAB> & {
	type: ScarabType
	tier: ScarabTier
}
