import { Id, OptionalRecord } from '@shared/types/utility.types'

function generateTypedId<T extends OptionalRecord>(id: string) {
	return id as Id<T>
}

export const BULKY_ID = {
	generateTypedId,
}
