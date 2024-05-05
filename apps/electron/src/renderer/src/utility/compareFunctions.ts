/**
 * Compare two objects with a 'baseType' property.
 * Can be used as compare function in array.sort()
 */
export function compareObjectsByBaseType<T extends { baseType: string }>(a: T, b: T) {
	const baseTypeA = a.baseType.toUpperCase()
	const baseTypeB = b.baseType.toUpperCase()

	return baseTypeA < baseTypeB ? -1 : baseTypeA > baseTypeB ? 1 : 0
}
