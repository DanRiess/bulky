import { ObjectValues } from '@shared/types/utility.types'
import { SCARAB_TYPE } from './scarab.const'

/** All possible scarab base types */
export type ScarabType = ObjectValues<typeof SCARAB_TYPE>
