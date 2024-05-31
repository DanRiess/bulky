/**
 * Compare two objects with a 'baseType' property.
 * Can be used as compare function in array.sort()
 */
export function compareObjectsByBaseType<T extends { baseType: string }>(a: T, b: T) {
	const baseTypeA = a.baseType.toUpperCase()
	const baseTypeB = b.baseType.toUpperCase()

	return baseTypeA < baseTypeB ? -1 : baseTypeA > baseTypeB ? 1 : 0
}

/**
 * Compare 2 strings.
 * Can be used as compare function in array.sort()
 */
export function compareStrings(a: string, b: string) {
	return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0
}
